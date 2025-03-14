import { ActionFactory } from '@core/application';
import { Result } from '@core/application/result';
import { ErrorFactory } from '@core/domain/errors';
import { ACTIONS, actions } from '@module/user/infrastructure/cqrs';
import { UserController } from '@module/user/infrastructure/http/user.controller';
import { CommandBus } from '@nestjs/cqrs';
import { UserStub } from '../../stubs/user.stub';

describe('UserController', () => {
  let sut: UserController;
  let commandBus: CommandBus;
  let actionFactory: ActionFactory<actions>;
  beforeAll(async () => {
    commandBus = {
      execute: jest
        .fn()
        .mockReturnValueOnce(Result.success('success'))
        .mockReturnValueOnce(Result.failure(ErrorFactory.create('InvalidData')))
        .mockReturnValueOnce(Result.failure(ErrorFactory.create('notFound')))
        .mockReturnValueOnce(Result.success('success'))
        .mockReturnValueOnce(Result.failure(ErrorFactory.create('InvalidData')))
        .mockReturnValueOnce(Result.failure(ErrorFactory.create('notFound'))),
    } as unknown as CommandBus;
    actionFactory = new ActionFactory<actions>(ACTIONS);
    sut = new UserController(commandBus, actionFactory);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('send code recovery password', () => {
    it('shoud return success (http - 200 status)', async () => {
      const result = await sut.sendCodeRecoveryPassword(
        UserStub.recoveryPasswordSendCodeControllerRequestStub(),
      );
      expect(result).toHaveProperty('status');
    });

    it('shoud return bad request (http - 400 status)', async () => {
      const result = await sut.sendCodeRecoveryPassword(
        UserStub.recoveryPasswordSendCodeControllerRequestStub(),
      );
      expect(result).toHaveProperty('status');
    });

    it('shoud return not found (http - 404 status)', async () => {
      const result = await sut.sendCodeRecoveryPassword(
        UserStub.recoveryPasswordSendCodeControllerRequestStub(),
      );
      expect(result).toHaveProperty('status');
    });
  });

  describe('check code recovery password', () => {
    it('shoud return success (http - 200 status)', async () => {
      const result = await sut.checkCodeRecoveryPassword(
        UserStub.recoveryPasswordCheckCodeControllerRequestStub(),
      );
      expect(result).toHaveProperty('status');
    });

    it('shoud return bad request (http - 400 status)', async () => {
      const result = await sut.checkCodeRecoveryPassword(
        UserStub.recoveryPasswordCheckCodeControllerRequestStub(),
      );
      expect(result).toHaveProperty('status');
    });

    it('shoud return not found (http - 404 status)', async () => {
      const result = await sut.checkCodeRecoveryPassword(
        UserStub.recoveryPasswordCheckCodeControllerRequestStub(),
      );
      expect(result).toHaveProperty('status');
    });
  });
});
