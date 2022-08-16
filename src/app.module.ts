import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from './modules/database/index';
import { TechnicalTestModule } from './modules/technical-test';
import * as Resolvers from './modules/technical-test/app.resolvers';


@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.gql'],
    }),
    DatabaseModule.forRoot(),
    TechnicalTestModule, 
  ],
  providers: [
    ...Object.values(Resolvers),
  ],
})
export class AppModule {}
