import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  FileAmostraResponse,
  FileResultado,
} from './interfaces/upload.interface';
import { AmostraAnaliseExternaRepository } from '../laboratorios-externos/amostra-analise-externa/repositories/amostra-analise-externa.repository';

@Injectable()
export class UploadService {
  constructor(
    private readonly amostraRepositorie: AmostraAnaliseExternaRepository,
  ) {}

  processExcel(buffer: Buffer): { amostras: FileAmostraResponse[] } {
    try {
      // Ler o arquivo Excel
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Converter para JSON (array de arrays)
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Encontrar a linha de cabeçalho "Type"
      let headerRowIndex = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === 'Type') {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        throw new BadRequestException('Cabeçalho "Type" não encontrado');
      }

      // Extrair cabeçalhos (elementos químicos e unidades)
      const elementosRow = data[headerRowIndex + 1];
      const unidadesRow = data[headerRowIndex + 2];

      const elementos: string[] = [];
      const unidades: string[] = [];

      for (let col = 2; col < elementosRow.length; col++) {
        const elemento = elementosRow[col];
        const unidade = unidadesRow[col];

        if (elemento && elemento !== 'Sample ID') {
          elementos.push(String(elemento).trim());
          unidades.push(unidade ? String(unidade).trim() : '');
        }
      }

      // Processar linhas de dados
      const amostras: FileAmostraResponse[] = [];

      for (let i = headerRowIndex + 2; i < data.length; i++) {
        const row = data[i];

        // Verificar se a coluna A (Type) contém "SMP"
        if (row[0] !== 'SMP') {
          continue;
        }

        // Extrair Sample ID da coluna B
        const sampleId = String(row[1] || '').trim();

        // Verificar se Sample ID contém data
        if (!this.hasDate(sampleId)) {
          continue; // Pular esta linha se não tiver data
        }

        // Extrair nome e datas
        const { nome, dataInicio, dataFim } = this.extractSampleInfo(sampleId);

        // Validação adicional: garantir que extraímos as datas corretamente
        if (!dataInicio || !dataFim) {
          continue;
        }

        // Extrair resultados
        const resultado: FileResultado[] = [];

        for (let col = 0; col < elementos.length; col++) {
          const valorCell = row[col + 2];
          let valor = '';

          if (
            valorCell !== undefined &&
            valorCell !== null &&
            valorCell !== ''
          ) {
            if (typeof valorCell === 'number') {
              valor = valorCell.toString().replace('.', ',');
            } else {
              valor = String(valorCell).trim();
            }
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

  // Novo método para verificar se o Sample ID contém data
  private hasDate(sampleId: string): boolean {
    // Verificar se contém padrão de data DD/MM/YYYY, DD/MM/YY ou DD/MM
    const datePattern = /\b\d{2}[-/]\d{2}([-/]\d{2,4})?\b/;
    return datePattern.test(sampleId);
  }

  private extractSampleInfo(sampleId: string): {
    nome: string;
    dataInicio: string;
    dataFim: string;
  } {
    // Captura formatos: DD/MM, DD/MM/YY, DD/MM/YYYY, DD-MM, DD-MM-YY, DD-MM-YYYY
    const dataRegex = '\\d{2}[-/]\\d{2}(?:[-/]\\d{2,4})?';

    // Padrão com intervalo "a" entre as datas
    const regexComIntervalo = new RegExp(
      `^(.*?)\\s+(${dataRegex})\\s*a\\s*(${dataRegex})$`,
      'i',
    );

    // Padrão com data única
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
    return {
      nome: sampleId.trim(),
      dataInicio: '',
      dataFim: '',
    };
  }

  async adicionaResultado(buffer: Buffer) {
    const formatData = (data: string): string => {
      const fData = data.trim().replaceAll('/', '-');
      const [dia, mes, ano] = fData.split('-');
      return `${ano}-${mes}-${dia}`;
    };

    const amostrasBuffer = this.processExcel(buffer).amostras;

    // 1. Mapeia as amostras para uma array de Promises
    const promises = amostrasBuffer.map(async (a) => {
      const query = {
        amostraName: a.nome,
        dataInicio: formatData(a.dataInicio),
        dataFim: formatData(a.dataFim),
      };
      // Retorna a Promise da busca
      const amostra = await this.amostraRepositorie.findFirstQuery(query);
      if(amostra.hasOwnProperty('elementosAnalisados')){
        amostra.elementosAnalisados = a.resultado;
      }
      return amostra; // Retorna o resultado da busca
    });

    // 2. Espera que todas as Promises sejam resolvidas
    // A 'resultados' será uma array com o resultado de cada Promise (incluindo null/undefined)
    const resultados = await Promise.all(promises);

    // 3. Filtra apenas as amostras válidas (não nulas/indefinidas)
    const amostras = resultados.filter((amostra) => amostra);

    return amostras;
  }
}
