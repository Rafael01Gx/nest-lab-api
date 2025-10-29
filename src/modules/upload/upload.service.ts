import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  FileAmostraResponse,
  FileResultado,
  UploadConfig,
} from './interfaces/upload.interface';
import { AmostraAnaliseExternaRepository } from '../laboratorios-externos/amostra-analise-externa/repositories/amostra-analise-externa.repository';

@Injectable()
export class UploadService {
  constructor(
    private readonly amostraRepositorie: AmostraAnaliseExternaRepository,
  ) {}

  processExcel(
    buffer: Buffer,
    config?: UploadConfig,
  ): { amostras: FileAmostraResponse[] } {
    const defaultConfig: Required<UploadConfig> = {
      headerSearch: { columnIndex: 0, value: 'Type' },
      elementosRowOffset: 1,
      unidadesRowOffset: 2,
      elementosStartColumn: 2,
      ignoreElementNames: ['Sample ID'],
      sampleTypeValue: 'SMP',
      sampleIdColumnOffset: 1,
      hasDateConfig: true,
      hasValuesConfig: [],
    };

    const settings = { ...defaultConfig, ...config };

    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Encontrar a linha de cabeçalho
      let headerRowIndex = -1;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i][settings.headerSearch.columnIndex] ===
          settings.headerSearch.value
        ) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        throw new BadRequestException(
          `Cabeçalho "${settings.headerSearch.value}" não encontrado na coluna ${settings.headerSearch.columnIndex}`,
        );
      }

      // Linhas configuráveis para elementos e unidades
      const elementosRow = data[headerRowIndex + settings.elementosRowOffset];
      const unidadesRow = data[headerRowIndex + settings.unidadesRowOffset];

      const elementos: string[] = [];
      const unidades: string[] = [];

      for (
        let col = settings.elementosStartColumn;
        col < elementosRow.length;
        col++
      ) {
        const elemento = elementosRow[col];
        const unidade = unidadesRow[col];

        if (
          elemento &&
          !settings.ignoreElementNames.includes(String(elemento).trim())
        ) {
          elementos.push(String(elemento).trim());
          unidades.push(unidade ? String(unidade).trim() : '');
        }
      }

      const amostras: FileAmostraResponse[] = [];

      for (
        let i = headerRowIndex + settings.unidadesRowOffset;
        i < data.length;
        i++
      ) {
        const row = data[i];
        if (!row) continue;

        // Verifica se a linha é do tipo esperado
        if (row[settings.headerSearch.columnIndex] !== settings.sampleTypeValue)
          continue;

        // Extrair Sample ID
        const sampleId = String(
          row[
            settings.headerSearch.columnIndex + settings.sampleIdColumnOffset
          ] || '',
        ).trim();

        // Filtro 1: verificar se contém data
        if (settings.hasDateConfig && !this.hasDate(sampleId)) continue;

        // Filtro 2: verificar se contém valores indesejados
        if (this.hasValues(sampleId, settings.hasValuesConfig)) continue;

        const { nome, dataInicio, dataFim } = this.extractSampleInfo(sampleId);
        if (!dataInicio || !dataFim) continue;

        const resultado: FileResultado[] = [];

        for (let col = 0; col < elementos.length; col++) {
          const valorCell = row[col + settings.elementosStartColumn];
          let valor = '';

          if (
            valorCell !== undefined &&
            valorCell !== null &&
            valorCell !== ''
          ) {
            valor =
              typeof valorCell === 'number'
                ? valorCell.toString().replace('.', ',')
                : String(valorCell).trim();
          }

          if (valor && valor !== '--') {
            resultado.push({
              elemento: elementos[col],
              valor: valor,
              unidade: unidades[col],
            });
          }
        }

        amostras.push({
          nome,
          dataInicio,
          dataFim,
          resultado,
        });
      }

      return { amostras };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao processar arquivo: ${error.message}`,
      );
    }
  }

  private hasDate(sampleId: string): boolean {
    const datePattern = /\b\d{2}[-/]\d{2}([-/]\d{2,4})?\b/;
    return datePattern.test(sampleId);
  }

  private hasValues(sampleId: string, values: string[]): boolean {
    if (!values?.length) return false;
    const normalizedId = sampleId.toLowerCase();
    return values.some((v) => normalizedId.includes(v.toLowerCase()));
  }

  private extractSampleInfo(sampleId: string): {
    nome: string;
    dataInicio: string;
    dataFim: string;
  } {
    const dataRegex = '\\d{2}[-/]\\d{2}(?:[-/]\\d{2,4})?';
    const regexComIntervalo = new RegExp(
      `^(.*?)\\s+(${dataRegex})\\s*a\\s*(${dataRegex})$`,
      'i',
    );
    const regexDataUnica = new RegExp(`^(.*?)\\s+(${dataRegex})$`, 'i');

    let match = sampleId.match(regexComIntervalo);
    if (match) {
      return {
        nome: match[1].trim(),
        dataInicio: match[2],
        dataFim: match[3],
      };
    }

    match = sampleId.match(regexDataUnica);
    if (match) {
      const data = match[2];
      return {
        nome: match[1].trim(),
        dataInicio: data,
        dataFim: data,
      };
    }

    return { nome: sampleId.trim(), dataInicio: '', dataFim: '' };
  }

  async adicionaResultado(buffer: Buffer, config?: UploadConfig) {
    const formatData = (data: string): string => {
      if (!data || typeof data !== 'string' || data.trim() === '') {
        return '';
      }
      const fData = data.trim().replaceAll('/', '-');
      const parts = fData.split('-');
      const currentYear = new Date().getFullYear();
      if (parts.length === 3) {
        let [dia, mes, ano] = parts;
        if (ano.length === 2) {
          ano = `20${ano}`;
        }
        return `${ano}-${mes}-${dia}`;
      }
      if (parts.length === 2) {
        const [dia, mes] = parts;
        return `${currentYear}-${mes}-${dia}`;
      }
      return '';
    };

    const resultadoProcessamento = this.processExcel(buffer, config);
    const amostrasBuffer = resultadoProcessamento?.amostras ?? [];

    const promises = amostrasBuffer.map(async (a) => {
      const query = {
        amostraName: a.nome,
        dataInicio: formatData(a.dataInicio),
        dataFim: formatData(a.dataFim),
      };

      const amostra = await this.amostraRepositorie.findFirstQuery(query);
      if (amostra?.hasOwnProperty('elementosAnalisados')) {
        amostra.elementosAnalisados = a.resultado;
      }
      return amostra;
    });

    const resultados = await Promise.all(promises);
    return resultados.filter((a) => a);
  }
}
