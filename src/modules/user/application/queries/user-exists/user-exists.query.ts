export type UserExistsQueryProps = {
  cpf: string;
};

export class UserExistsQuery {
  readonly cpf: string;
  constructor(props: UserExistsQueryProps) {
    Object.assign(this, props);
  }
}
