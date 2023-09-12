export type UserSaveFirstLoginProps = {
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
};

export class UserSaveFirstLoginCommand {
  readonly name: string;
  readonly cpf: string;
  readonly birthDate: string;
  readonly phone: string;
  readonly email: string;
  readonly password: string;
  constructor(props: UserSaveFirstLoginProps) {
    Object.assign(this, props);
  }
}
