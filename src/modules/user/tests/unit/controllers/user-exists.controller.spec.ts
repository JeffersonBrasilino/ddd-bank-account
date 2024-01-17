import { ActionFactory } from '@core/application';
import { Result } from '@core/application/result';
import { ErrorFactory } from '@core/domain/errors';
import { ACTIONS, actions } from '@module/user/infrastructure/cqrs';
import { UserExistsController } from '@module/user/infrastructure/http/user-exists/user-exists.controller';
import { CommandBus } from '@nestjs/cqrs';
import { UserStub } from '../../stubs/user.stub';

describe('UserExistsController', () => {
  let sut: UserExistsController;
  let commandBus: CommandBus;
  let actionFactory: ActionFactory<actions>;
  beforeAll(async () => {
    commandBus = {
      execute: jest
        .fn()
        .mockReturnValueOnce(Result.success('success'))
        .mockReturnValueOnce(Result.failure(ErrorFactory.create('InvalidData')))
        .mockReturnValueOnce(Result.failure(ErrorFactory.create('notFound'))),
    } as unknown as CommandBus;
    actionFactory = new ActionFactory<actions>(ACTIONS);
    sut = new UserExistsController(commandBus, actionFactory);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('shoud return success (http - 200 status)', async () => {
    const result = await sut.login(UserStub.userExistsControllerRequestStub());
    expect(result).toHaveProperty('status');
  });

  it('shoud return bad request (http - 400 status)', async () => {
    const result = await sut.login(UserStub.userExistsControllerRequestStub());
    expect(result).toHaveProperty('status');
  });

  it('shoud return not found (http - 404 status)', async () => {
    const result = await sut.login(UserStub.userExistsControllerRequestStub());
    expect(result).toHaveProperty('status');
  });
});
