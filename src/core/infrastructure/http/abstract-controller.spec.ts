import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { httpStatusCodes } from './http-response';
import { AbstractController } from './abstract-controller';

class TestController extends AbstractController {
  public call(error: AbstractError<any>) {
    return this.processError(error);
  }
}

describe('AbstractController.processError', () => {
  let controller: TestController;

  beforeEach(() => {
    controller = new TestController();
  });

  it('maps NotFoundError to 404 NOT_FOUND_CODE', () => {
    const err = ErrorFactory.create('NotFound', 'missing');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.NOT_FOUND_CODE);
  });

  it('maps ValidationError to 400 BAD_REQUEST_CODE', () => {
    const err = ErrorFactory.create('Validation', 'bad');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.BAD_REQUEST_CODE);
  });

  it('maps InvalidDataError to 400 BAD_REQUEST_CODE', () => {
    const err = ErrorFactory.create('InvalidData', 'bad');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.BAD_REQUEST_CODE);
  });

  it('maps AlreadyExistsError to 409 CONFLICT_CODE', () => {
    const err = ErrorFactory.create('AlreadyExists', 'dup');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.CONFLICT_CODE);
  });

  it('maps DependencyError to 424 FAILED_DEPENDENCY', () => {
    const err = ErrorFactory.create('Dependency', 'dep');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.FAILED_DEPENDENCY);
  });

  it('maps ProcessingError to 422 UNPROCESSABLE_ENTITY', () => {
    const err = ErrorFactory.create('Processing', 'proc');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it('maps InternalError to 500 INTERNAL_SERVER_ERROR_CODE', () => {
    const err = ErrorFactory.create('Internal', 'boom');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR_CODE);
  });

  it('maps RuleError to 400 BAD_REQUEST_CODE', () => {
    const err = ErrorFactory.create('Rule', 'rule');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.BAD_REQUEST_CODE);
  });

  it('maps UnauthorizedError to 401 UNAUTHORIZED_CODE', () => {
    const err = ErrorFactory.create('Unauthorized', 'no auth');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.UNAUTHORIZED_CODE);
  });

  it('maps ForbiddenError to 403 FORBIDDEN_CODE', () => {
    const err = ErrorFactory.create('Forbidden', 'forbid');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.FORBIDDEN_CODE);
  });

  it('falls back to 500 for unknown error class', () => {
    class UnknownError extends AbstractError<string> {
      constructor(message: string) {
        super(message);
      }
    }
    const err = new UnknownError('mystery');
    const res = controller.call(err);
    expect(res.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR_CODE);
  });

  it('type-rejects string argument at compile time', () => {
    const controllerTyped: TestController = controller;
    // @ts-expect-error: string is not assignable to AbstractError<any>
    controllerTyped.call('plain string');
  });
});