export class ElementoAnalisadoDto {
  elemento: string;
  valor: string;
  unidade: string;
  constructor(data: ElementoAnalisadoDto) {
    this.elemento = data.elemento;
    this.unidade = data.unidade;
    this.valor = data.valor;
  }
}