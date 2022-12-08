import {Inject, Injectable} from '@nestjs/common';

import {Sequelize} from 'sequelize-typescript';
import {QueryTypes} from 'sequelize';

import {CreatePlateInput, Plate} from './types/plates.type';
import {OrderFilters} from "./types/orders.type";
import {ClientIdentifiers} from "./types/clients.type";

type Attr = {
  primaryKey?: boolean;
}

function attributeFilter(model, attributes) {
  // Keep primary keys for potential sub relation loadings
  return Object.entries(model.getAttributes())
    .filter(([key, attr]: [string, Attr]) => attr.primaryKey || attributes.includes(key))
    .map(([key, attr]) => key);
}

@Injectable()
export class TechnicalTestComponent {
  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  async getAllPlates(attributes) {
    let plates = await this.sequelize.models.Plate.findAll({ attributes});
    return plates.map((plate) => plate.get({ plain: true }));
  }

  async getPlateById(id: string) {
    const res = await this.sequelize.query<Plate>(/* sql */ `SELECT * FROM plates WHERE id = :id`, {
      type: QueryTypes.SELECT,
      replacements: { id },
    });
    if (!res.length) {
      return null;
    }
    return res[0];
  }

  async createPlate(data: CreatePlateInput) {
    return this.sequelize.query(
      /* sql */ `INSERT INTO plates (id, name, color, format, radius, price) VALUES (uuid_generate_v4(), :name, :color, :format, :radius, :price)`,
      {
        type: QueryTypes.INSERT,
        replacements: {
          name: data.name,
          color: data.color,
          radius: data.radius,
          format: data.format,
          price: data.price,
        },
      },
    );
  }

  async getClient(id: string, attributes?: string[]) {
    try {
      const client = await this.sequelize.models.Client.findOne({
        attributes: attributeFilter(this.sequelize.models.Client, attributes),
        where: {id}
      });
      return client.get({ plain: true });
    } catch (e) {
      return null;
    }
  }

  async listOrders(options: OrderFilters, attributes: string) {
    const orders = await this.sequelize.models.Order.findAll({
      attributes: attributeFilter(this.sequelize.models.Order, attributes),
      ...options && {
        where: {
          ...options.clientId && { client_id: options.clientId },
          ...options.state && { state: options.state },
        }
      }
    });
    return orders.map((order) => order.get({ plain: true }));
  }

  async findClient(options: ClientIdentifiers, attributes: string[]) {
    try {
      // Use findAll with to detect duplicates and because findOne generate awful SQL Query with 3 nested selects
      const clients = await this.sequelize.models.Client.findAll({
        attributes: attributeFilter(this.sequelize.models.Client, attributes),
        ...options.orderId && {
          include: [{
            as: 'orders',
            model: this.sequelize.models.Order,
            attributes: [],
            where: {id: options.orderId},
            required: true,
          }]
        },
      });

      // length should be 1 or 0, TODO throw error if length > 1 ?
      return clients.length === 1 ? clients[0].get({ plain: true }) : null;
    } catch (e) {
      return null;
    }
  }
}
