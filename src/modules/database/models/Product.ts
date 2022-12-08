import { Sequelize, DataTypes } from "sequelize";
import {PlateColorEnum, PlateFormatEnum} from "../../technical-test/types/plates.type";

export function init(sequelize: Sequelize) {
  sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'products',
    timestamps: false,
  });
}

export function associate(sequelize: Sequelize): void {
  const { Order, OrderProduct, Product } = sequelize.models;

  Product.belongsToMany(Order, { as: 'orders', through: OrderProduct, foreignKey: 'product_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
}
