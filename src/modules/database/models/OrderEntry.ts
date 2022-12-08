import { Sequelize, DataTypes } from "sequelize";
import { OrderStateEnum } from "../../technical-test/types/orders.type";

export function init(sequelize: Sequelize) {
  sequelize.define('OrderEntry', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'number',
    }
  }, {
    tableName: 'order_products',
    timestamps: false,
  });
}
