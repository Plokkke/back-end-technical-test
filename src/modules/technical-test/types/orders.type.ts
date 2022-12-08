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

export class OrderEntry {
  order_id: string; // uuid

  product_id: string; // uuid

  quantity: number;
}

export type OrderFilters = {
  clientId?: string;
  state?: OrderStateEnum;
}

export type OrderEntryFilters = {
  orderId: string; // TODO switch to optional when there will be other ways to filter
}
