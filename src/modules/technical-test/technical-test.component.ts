import {Inject, Injectable} from '@nestjs/common';

import {Sequelize} from 'sequelize-typescript';
import {QueryTypes} from 'sequelize';

import DataLoader from 'dataloader';

import {CreatePlateInput, Plate} from './types/plates.type';
import {Order, OrderEntry, OrderEntryFilters, OrderFilters} from "./types/orders.type";
import {Client, ClientIdentifiers} from "./types/clients.type";
import {Product} from "./types/product.type";

type Attr = {
  primaryKey?: boolean;
}

type ClientLoadPayload = {
  identifiers: ClientIdentifiers;
  attributes?: string[];
}

type OrderEntryLoadPayload = {
  filters: OrderEntryFilters;
  attributes?: string[];
}

type ProductLoadPayload = {
  id: string;
  attributes?: string[];
}

function attributeFilter(model, attributes = []) {
  // Keep primary keys for potential sub relation loadings
  return Object.entries(model.getAttributes())
    .filter(([key, attr]: [string, Attr]) => attr.primaryKey || attributes.includes(key))
    .map(([key, attr]) => key);
}

function uniques(values) {
  return [ ...new Set(values) ];
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

  #clientLoader = new DataLoader(async (payloads: ClientLoadPayload[]) => {
    // TODO assert that payloads identifier have at least one key
    const attributes = uniques(payloads.flatMap((payload) => payload.attributes).filter(Boolean));
    const ids = uniques(payloads.map((payload) => payload.identifiers.id).filter(Boolean));
    const orderIds = uniques(payloads.map((payload) => payload.identifiers.orderId).filter(Boolean));
    const clients = [
      ...ids.length ? await this.sequelize.models.Client.findAll({
        attributes: attributeFilter(this.sequelize.models.Client, attributes),
        where: {id: ids},
      }) : [],
      ...orderIds.length ? await this.sequelize.models.Client.findAll({
        attributes: attributeFilter(this.sequelize.models.Client, attributes),
        include: [{
          model: this.sequelize.models.Order,
          as: 'orders',
          where: { id: orderIds },
          attributes: attributeFilter(this.sequelize.models.Order),
          required: true,
        }],
      }) : [],
    ]
    const clientsMapping = clients.reduce((acc, client) => {
      const clientPlain: Client = client.get({ plain: true });
      acc.byId[clientPlain.id] = client;
      const orders = clientPlain['orders'] as Order[];
      if (orders) {
        orders.forEach((order) => {
          acc.byOrderId[order.id] = client;
        });
      }
      return acc;
    } , { byId: {}, byOrderId: {} });
    return payloads.map((payload) => {
      if (payload.identifiers.id) {
        return clientsMapping.byId[payload.identifiers.id];
      }
      if (payload.identifiers.orderId) {
        return clientsMapping.byOrderId[payload.identifiers.orderId];
      }
      // Can't happen due to the assertion at the beginning of the function
    });
  })

  async getClient(id: string, attributes?: string[]) {
    return this.#clientLoader.load({ identifiers: { id }, attributes });
  }

  async findClient(identifiers: ClientIdentifiers, attributes: string[]) {
    return this.#clientLoader.load({ identifiers, attributes });
  }

  async listOrders(options: OrderFilters, attributes: string[]) {
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

  #entriesLoader = new DataLoader(async (payloads: OrderEntryLoadPayload[]) => {
    const attributes = uniques(payloads.flatMap((payload) => payload.attributes).filter(Boolean));
    const orderIds = uniques(payloads.flatMap((payload) => payload.filters.orderId).filter(Boolean));
    const entries = await this.sequelize.models.OrderEntry.findAll({
      where: { order_id: orderIds },
      attributes: attributeFilter(this.sequelize.models.OrderEntry, attributes),
      include: [{
        model: this.sequelize.models.Product,
        as: 'product',
        attributes: attributeFilter(this.sequelize.models.Product, attributes),

      }]
    })
    const entriesByOrderId = entries.reduce((acc, entry) => {
      const entryPlain: OrderEntry = entry.get({ plain: true });
      const orderId = entryPlain.order_id;
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(entryPlain);
      return acc;
    }, {});
    return payloads
      .map((payload) => entriesByOrderId[payload.filters.orderId]);
  })

  async getOrderEntries(filters: OrderEntryFilters, attributes: string[]) {
    return this.#entriesLoader.load({ filters, attributes });
  }

  #productLoader = new DataLoader(async (payloads: ProductLoadPayload[]) => {
    const attributes = uniques(payloads.flatMap((payload) => payload.attributes).filter(Boolean));
    const ids = uniques(payloads.map((payload) => payload.id));
    const products = await this.sequelize.models.Product.findAll({
      attributes: attributeFilter(this.sequelize.models.Product, attributes),
      where: { id: ids },
    });
    const productsById = products.reduce((acc, product) => {
      const productPlain: Product = product.get({ plain: true });
      acc[productPlain.id] = productPlain;
      return acc;
    }, {});
    return payloads.map(({ id }) => productsById[id]);
  })

  async getProduct(id: string, attributes: string[]) {
    return this.#productLoader.load({ id, attributes });
  }
}
