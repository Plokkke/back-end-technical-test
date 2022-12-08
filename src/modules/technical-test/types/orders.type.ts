export enum OrderStateEnum {
  WAITING = 'WAITING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export class Order {
  id: string; // uuid

  client_id: number;

  state: OrderStateEnum;
}

export class OrderProduct {
  order_id: string; // uuid

  product_id: string; // uuid

  number: number;
}
