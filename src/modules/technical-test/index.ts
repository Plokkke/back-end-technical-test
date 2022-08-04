import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { TechnicalTestComponent } from './technical-test.component';

@Module({
  imports: [DatabaseModule.forRoot()],
  providers: [TechnicalTestComponent],
  exports: [TechnicalTestComponent],
})
export class TechnicalTestModule {}