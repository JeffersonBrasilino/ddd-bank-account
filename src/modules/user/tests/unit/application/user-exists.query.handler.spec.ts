import { Result } from '@core/application/result';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { UserExistsQueryHandler } from '@module/user/application/queries/user-exists/user-exists.query.handler';
import { UserExistsGatewayInterface } from '@module/user/domain/contracts/user-exists.gateway.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { UserExistsGatewayMock } from '../../mocks/user-exists.gateway.mock';
import { userRepo } from '../../mocks/user.repository.mock';
import { UserStub } from '../../stubs/user.stub';

describe('UserExistsQueryHandler', () => {
  let sut: UserExistsQueryHandler;
  beforeAll(() => {
    sut = new UserExistsQueryHandler(
      UserExistsGatewayMock,
      userRepo,
      new UserMapper(),
    );
  });
    beforeEach(() => {
      jest.restoreAllMocks();
    });


  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be successfull when exists cpf in database', async () => {
    const response = await sut.execute(UserStub.userExistsQueryStub());
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(true);
    expect((response as Result<any>).getValue()).toEqual({
      firstLogin: false,
    });
  });

  it('should be successfull when dont exists in database but exists in gateway', async () => {
    const response = await sut.execute(
      UserStub.userExistsQueryStub('42108254099'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isSuccess()).toBe(true);
    expect((response as Result<any>).getValue()).toMatchObject({
      firstLogin: true,
      cpf: '42108254099',
    });
  });

  it('should be error when dont exists in database and dont exists in gateway', async () => {
    const response = await sut.execute(
      UserStub.userExistsQueryStub('dont_exists'),
    );
    expect(response).toBeInstanceOf(Result);
    expect((response as Result<any>).isFailure()).toBe(true);
    expect((response as Result<any>).getError()).toBeInstanceOf(NotFoundError);
  });
});
