export enum PlateColorEnum {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
}

export enum PlateFormatEnum {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  PASTA = 'PASTA',
  SOUP = 'SOUP',
}

export interface CreatePlateInput {
  name: string;

  color: PlateColorEnum;

  format: PlateFormatEnum;

  radius: number;

  price: number;
}

export class Plate {
  id: string; // uuid

  name: string;

  color: PlateColorEnum;

  format: PlateFormatEnum;

  radius: number;

  price: number;
}
