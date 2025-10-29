export interface FileResultado {
  elemento: string;
  valor: string;
  unidade: string;
}

export interface FileAmostraResponse {
  nome: string;
  dataInicio: string;
  dataFim: string;
  resultado: FileResultado[];
}

export interface UploadConfig {
  // Localização do cabeçalho principal ("Type")
  headerSearch?: {
    columnIndex: number;
    value: string;
  };

  // Linhas e colunas de extração
  elementosRowOffset?: number; // linha após o cabeçalho onde ficam os elementos
  unidadesRowOffset?: number; // linha após os elementos onde ficam as unidades
  elementosStartColumn?: number; // primeira coluna dos elementos
  ignoreElementNames?: string[];

  // Identificação da amostra
  sampleTypeValue?: string; // valor esperado (ex: 'SMP')
  sampleIdColumnOffset?: number; // coluna que contém o Sample ID (em relação ao headerSearch.columnIndex)

  // Filtros opcionais
  hasDateConfig?: boolean; // ativa ou não a verificação de data
  hasValuesConfig?: string[]; // termos que, se encontrados no sampleId, fazem pular a linha
}