export enum ProductColorEnum {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
}

export enum ProductFormatEnum {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  PASTA = 'PASTA',
  SOUP = 'SOUP',
}

export interface CreateProductInput {
  name: string;

  color: ProductColorEnum;

  format: ProductFormatEnum;

  radius: number;

  price: number;
}

export class Product {
  id: number;

  name: string;

  color: ProductColorEnum;

  format: ProductFormatEnum;

  radius: number;

  price: number;
}
