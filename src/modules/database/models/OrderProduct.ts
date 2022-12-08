import { Sequelize, DataTypes } from "sequelize";
import { OrderStateEnum } from "../../technical-test/types/orders.type";

export function init(sequelize: Sequelize) {
  sequelize.define('OrderProduct', {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'order_products',
    timestamps: false,
  });
}
