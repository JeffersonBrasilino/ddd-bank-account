export type RefreshAuthTokenProps = {
  refreshToken: string;
};

export class RefreshAuthTokenCommand {
  readonly refreshToken: string;
  constructor(props: RefreshAuthTokenProps) {
    Object.assign(this, props);
  }
}
