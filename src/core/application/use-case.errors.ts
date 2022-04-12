import { Result } from '@core/shared/result';

/**
 * classes de erros para os casos de uso.
 * classes com nomes parecidos com os codigos http, para ajudar a entender cada contexto
 * de erro a ser retornado.
 * estas classes podem ser extendiveis para erros especificos.
 */

/**
 * classe de erro geral, para criar novos erros que não existem ou que seja bem
 * especifico, usar esta classe
 * @param msg erro a ser retornado (string | T)
 * @returns Result<T>
 */
export class ErrorUseCase<T> extends Result<T> {
  constructor(msg: T | string) {
    super(false, msg);
  }
}

/**
 * classe de conflito, serve para indicar que um recurso ja existe e na pode ser criado.
 * @param msg erro a ser retornado (string | T)
 * @returns ErrorUseCase<T>
 */
export class ConflictErrorUseCase<T> extends ErrorUseCase<T> {
  constructor(msg: T | string) {
    super(msg);
  }
}

/**
 * classe de nao existe, serve para indicar que um recurso a ser consultado nao existe.
 * @param msg erro a ser retornado (string | T)
 * @returns ErrorUseCase<T>
 */
export class NotFoundErrorUseCase<T> extends ErrorUseCase<T> {
  constructor(msg: T | string) {
    super(msg);
  }
}

/**
 * classe de erro de aplicação, serve para indicar um erro desconhecido.
 * @param msg erro a ser retornado (string | T)
 * @returns ErrorUseCase<T>
 */
export class InternalErrorUseCase<T> extends ErrorUseCase<T> {
  constructor(msg: T | string) {
    super(msg);
  }
}

/**
 * classe de requisicao ruim, serve para indicar que uma requisicao nao pode ser concluida
 * por conta de erro de dados do cliente.
 * @param msg erro a ser retornado (string | T)
 * @returns ErrorUseCase<T>
 */
export class BadRequesErrortUseCase<T> extends ErrorUseCase<T> {
  constructor(msg: T | string) {
    super(msg);
  }
}
