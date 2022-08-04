import { Inject, Injectable } from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

import { Product, CreateProductInput } from './types/products.type';

@Injectable()
export class TechnicalTestComponent {
  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  async getAllProducts() {
    return this.sequelize.query<Product>(/* sql */ `SELECT * FROM products`, {
      type: QueryTypes.SELECT,
    });
  }

  async getProductById(id: string) {
    return this.sequelize.query<Product>(/* sql */ `SELECT * FROM products WHERE id = :id`, {
      type: QueryTypes.SELECT,
      replacements: { id },
    });
  }

  async createProduct(data: CreateProductInput) {
    return this.sequelize.query(
      /* sql */ `INSERT INTO products (id, name, color, format, radius, price) VALUES (uuid_generate_v4(), :name, :color, :format, :radius, :price)`,
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
}
