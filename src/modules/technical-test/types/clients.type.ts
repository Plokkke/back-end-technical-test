export class Client {
  id: string; // uuid

  first_name: string;

  last_name: string;

  email: string;

  address: string;
}

export type ClientIdentifiers = {
  id?: string;
  orderId?: string;
}
