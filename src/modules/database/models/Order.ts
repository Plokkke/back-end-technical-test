import { Sequelize, DataTypes } from "sequelize";
import { OrderStateEnum } from "../../technical-test/types/orders.type";

export function init(sequelize: Sequelize) {
  sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    state: {
      type: DataTypes.ENUM(...Object.values(OrderStateEnum)),
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'orders',
    timestamps: false,
  });
}
export function associate(sequelize: Sequelize): void {
  const { Client, Order, OrderProduct, Product } = sequelize.models;

  Order.belongsTo(Client, { as: 'client', foreignKey: 'client_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  Order.belongsToMany(Product, { as: 'products', through: OrderProduct, foreignKey: 'order_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
}
