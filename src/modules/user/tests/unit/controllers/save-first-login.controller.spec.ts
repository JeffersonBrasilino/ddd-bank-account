import { ActionFactory } from '@core/application';
import { DomainValidationError } from '@core/domain/errors';
import { DataNotFoundError } from '@core/infrastructure/errors';
import { Result } from '@core/application/result';
import { ACTIONS, actions } from '@module/user/infrastructure/cqrs';
import { UserSaveFirstLoginController } from '@module/user/infrastructure/http/user-save-first-login/user-save-first-login.controller';
import { CommandBus } from '@nestjs/cqrs';
import { UserStub } from '../../stubs/user.stub';

describe('UserSaveFirstLoginController', () => {
  let sut: UserSaveFirstLoginController;
  let commandBus: CommandBus;
  let actionFactory: ActionFactory<actions>;
  beforeAll(async () => {
    commandBus = {
      execute: jest
        .fn()
        .mockReturnValueOnce(Result.success('success'))
        .mockReturnValueOnce(
          Result.failure(new DomainValidationError('error validation')),
        )
        .mockReturnValueOnce(
          Result.failure(new DataNotFoundError('not Exists')),
        ),
    } as unknown as CommandBus;
    actionFactory = new ActionFactory<actions>(ACTIONS);
    sut = new UserSaveFirstLoginController(commandBus, actionFactory);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('shoud return success (http - 200 status)', async () => {
    const result = await sut.execute(
      UserStub.saveFirstLoginControllerRequestStub(),
    );
    expect(result).toHaveProperty('status');
  });

  it('shoud return bad request (http - 400 status)', async () => {
    const result = await sut.execute(
      UserStub.saveFirstLoginControllerRequestStub(),
    );
    expect(result).toHaveProperty('status');
  });

  it('shoud return not found (http - 404 status)', async () => {
    const result = await sut.execute(
      UserStub.saveFirstLoginControllerRequestStub(),
    );
    expect(result).toHaveProperty('status');
  });
});
