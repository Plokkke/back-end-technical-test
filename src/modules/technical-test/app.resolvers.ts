import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { TechnicalTestComponent } from "./technical-test.component";
import { CreatePlateInput, Plate } from "./types/plates.type";

@Resolver('Plate')
export class PlateResolver {
  constructor(private readonly component: TechnicalTestComponent) {}

  @Query('Plates')
  async getPlates(): Promise<Plate[]> {
    return this.component.getAllPlates();
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