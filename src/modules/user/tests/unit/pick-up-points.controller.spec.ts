import { CqrsFactoryProvider } from '@core/infrastructure/cqrs/cqrs-factory.provider';
import {
  COMMANDS,
  commandsAction,
  QUERIES,
  queriesAction,
} from '@module/pick-up-points/infrastructure/cqrs/contracts/command-query.types';
import { Provider } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { HealthCheckResult } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { PickUpPointsController } from '../../infrastructure/http/user.controller';

describe('PickUpPointsController', () => {
  let sut: PickUpPointsController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const commandFactory: Provider = {
    provide: 'PickUpPointsCommandFactory',
    useFactory: () => CqrsFactoryProvider.create<commandsAction>(COMMANDS),
  };
  const queryFactory: Provider = {
    provide: 'PickUpPointsQueryFactory',
    useFactory: () => CqrsFactoryProvider.create<queriesAction>(QUERIES),
  };
  const mockHealthCheckResult: HealthCheckResult = {
    status: 'ok',
    details: {
      'health-indicator-1': {
        status: 'up',
      },
    },
  };

  const commandBusFactory: Provider = {
    provide: CommandBus,
    useFactory: () =>
      ({
        execute: jest.fn(),
      } as unknown as CommandBus),
  };
  const queryBusFactory: Provider = {
    provide: QueryBus,
    useFactory: () =>
      ({
        execute: jest.fn(),
      } as unknown as QueryBus),
  };

  /*   const mockHealthService = mock<HealthService>({
    performHealthCheck: jest.fn(async () => mockHealthCheckResult),
  }) */

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PickUpPointsController],
      providers: [
        commandBusFactory,
        queryBusFactory,
        commandFactory,
        queryFactory,
        /*{
          provide: HealthService,
          useValue: mockHealthService,
        },*/
      ],
    }).compile();
    sut = module.get<PickUpPointsController>(PickUpPointsController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
