export enum OrderStateEnum {
  WAITING = 'WAITING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export class Order {
  id: number;

  client_id: number;

  state: OrderStateEnum;
}

export class OrderProduct {
  order_id: number;

  product_id: number;

  number: number;
}
