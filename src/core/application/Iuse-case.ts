export interface IUseCase<Req, Res> {
  execute(request?: Req): Promise<Res> | Res;
}
