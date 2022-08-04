import { DynamicModule, Module } from '@nestjs/common';
import { databaseProvider } from './database.providers';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const providers = [databaseProvider];
    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    };
  }
}