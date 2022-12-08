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

export function associate(sequelize: Sequelize): void {
  const { Order, OrderEntry, Product } = sequelize.models;

  // For graphql optimization
  OrderEntry.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
  OrderEntry.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
}
