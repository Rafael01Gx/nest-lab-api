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