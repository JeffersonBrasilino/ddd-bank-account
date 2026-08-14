import { Module, OnModuleInit } from "@nestjs/common";

import { LoggerFactory } from "./logger.factory";

@Module({})
export class LoggerModule implements OnModuleInit {
  public onModuleInit(): void {
    LoggerFactory.create();
  }
}
