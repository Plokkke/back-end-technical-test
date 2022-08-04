import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/index';
import { TechnicalTestModule } from './modules/technical-test';

@Module({
  imports: [DatabaseModule.forRoot(), TechnicalTestModule],
  controllers: [AppController],
})
export class AppModule {}
