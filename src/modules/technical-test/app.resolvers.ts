import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { transpileModule } from "typescript";
import { TechnicalTestComponent } from "./technical-test.component";
import { CreateProductInput, Product } from "./types/products.type";

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly component: TechnicalTestComponent) {}

  @Query('Products')
  async getProducts(): Promise<Product[]> {
    return this.component.getAllProducts();
  }

  @Query('Product')
  async getProductById(@Args('id') id: string): Promise<Product | null> {
    return this.component.getProductById(id);
  }

  @Mutation('createProduct')
  async createProduct(@Args('data') data: CreateProductInput): Promise<boolean> {
    await this.component.createProduct(data);
    return true;
  }
}