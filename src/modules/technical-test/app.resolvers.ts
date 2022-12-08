import { Resolver, Query, Args, Mutation, Info, ResolveField, Parent } from "@nestjs/graphql";
import { TechnicalTestComponent } from "./technical-test.component";
import { CreatePlateInput, Plate } from "./types/plates.type";
import { Client } from "./types/clients.type";
import { Order, OrderEntry, OrderFilters } from "./types/orders.type";

function getAttributes(info) {
  return info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
}

@Resolver('Plate')
export class PlateResolver {
  constructor(private readonly component: TechnicalTestComponent) {}

  @Query('Plates')
  async getPlates(@Info() info): Promise<Plate[]> {
    return this.component.getAllPlates(getAttributes(info));
  }

  @Query('Plate')
  async getPlateById(@Args('id') id: string): Promise<Plate | null> {
    return this.component.getPlateById(id);
  }

  @Mutation('createPlate')
  async createPlate(@Args('data') data: CreatePlateInput): Promise<boolean> {
    await this.component.createPlate(data);
    return true;
  }
}

@Resolver('Client')
export class ClientResolver {
  constructor(private readonly component: TechnicalTestComponent) {}

  @Query('Client')
  async getClient(@Info() info, @Args('id') id: string): Promise<Client | null> {
    return this.component.getClient(id, getAttributes(info));
  }

  @ResolveField('orders')
  async orders(@Info() info, @Parent() client: Client, @Args('filters') filters: OrderFilters): Promise<Order[]> {
    return this.component.listOrders({ clientId: client.id, ...filters }, getAttributes(info));
  }
}

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly component: TechnicalTestComponent) {}

  @Query('Orders')
  async listOrder(@Info() info, @Args('filters') filters: OrderFilters): Promise<Order[]> {
    return this.component.listOrders(filters, getAttributes(info));
  }

  @ResolveField('client')
  async client(@Info() info, @Parent() order: Order) {
    // TODO use data loader to avoid N+1
    return this.component.findClient({ orderId: order.id }, getAttributes(info));
  }

  @ResolveField('amount')
  async amount(@Parent() order: Order) {
    const entries = await this.component.getOrderEntries({ orderId: order.id }, ['quantity', 'price']);
    return entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  }

  @ResolveField('entries')
  async entries(@Info() info, @Parent() order: Order) {
    return this.component.getOrderEntries({ orderId: order.id }, [ 'quantity' ]);
  }
}

@Resolver('OrderEntry')
export class OrderEntryResolver {
  constructor(private readonly component: TechnicalTestComponent) {}
  @ResolveField('product')
  async product(@Info() info, @Parent() entry: OrderEntry) {
    return this.component.getProduct(entry.product_id, getAttributes(info));
  }
}
