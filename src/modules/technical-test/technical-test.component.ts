import { Inject, Injectable } from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

import { Plate, CreatePlateInput } from './types/plates.type';

@Injectable()
export class TechnicalTestComponent {
  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

  async getAllPlates() {
    return this.sequelize.query<Plate>(/* sql */ `SELECT * FROM plates`, {
      type: QueryTypes.SELECT,
    });
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
}
