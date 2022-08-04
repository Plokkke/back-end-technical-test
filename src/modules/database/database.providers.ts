import { Sequelize } from "sequelize-typescript";

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
      await sequelize.sync();
      return sequelize;
    },
  };