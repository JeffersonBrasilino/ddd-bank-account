/**
 * Exceções de dominio
 * retorna um erro funcional para a camada de aplicação, evitando assim usar um throw, garantindo ordem de
 * execução do processo.
 * esta classe pode ser usada para lançar erros ou para extenção de erros especificos do DOMINIO.
 * @Param errorOrMessage erros a serem lançados (string | array<string>).
 * @Returns Result<DomainException> result de erros retornados.
 *
 */
export class DomainError {
  constructor(readonly errorOrMessage: string | Array<string> | Partial<any>) {}

  getError() {
    return this.errorOrMessage;
  }
}
