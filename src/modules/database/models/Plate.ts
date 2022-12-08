import { Sequelize, DataTypes } from "sequelize";
import {PlateColorEnum, PlateFormatEnum} from "../../technical-test/types/plates.type";

export function init(sequelize: Sequelize) {
  sequelize.define('Plate', {
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
    color: {
      type: DataTypes.ENUM(...Object.values(PlateColorEnum)),
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM(...Object.values(PlateFormatEnum)),
      allowNull: false,
    },
    radius: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'plates',
    timestamps: false,
  });
}
