import { Sequelize, DataTypes } from "sequelize";

export function init(sequelize: Sequelize) {
  sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'clients',
    timestamps: false,
  });
}
export function associate(sequelize: Sequelize): void {
  const { Client, Order } = sequelize.models;

  Client.hasMany(Order, { as: 'orders', foreignKey: 'client_id' });
}
