import { Sequelize } from "sequelize-typescript";

import * as modelsByName from './models';

export type SequelizeModel = {
  init: (sequelize: Sequelize) => void;
  associate?: (sequelize: Sequelize) => void;
}

export const databaseProvider =
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: '',
        port: 0,
        username: '',
        password: '',
        database: '',
      });

      const models: SequelizeModel[] = Object.values(modelsByName);
      models
        .filter(model => typeof model.init === 'function')
        .forEach(model => model.init(sequelize));
      models
        .filter(model => typeof model.associate === 'function')
        .forEach(model => model.associate(sequelize));

      await sequelize.sync();
      return sequelize;
    },
  };