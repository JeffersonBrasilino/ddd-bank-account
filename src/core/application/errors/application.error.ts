export class ApplicationError {
  constructor(private errorOrMessage: string | string[] | Partial<any>) {}
  getError(): string | string[] | Partial<any> {
    return this.errorOrMessage;
  }
}
