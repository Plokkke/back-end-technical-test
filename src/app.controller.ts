import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { TechnicalTestComponent } from './modules/technical-test/technical-test.component';
import { CreateProductInput } from './modules/technical-test/types/products.type';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly component: TechnicalTestComponent) {}

  @Get('/products')
  async getAllProducts(@Res() res: Response): Promise<Response> {
    return res.status(HttpStatus.OK).json(await this.component.getAllProducts());
  }

  @Get('/products/:id')
  async getProductById(@Param() params: { id: string }, @Res() res: Response): Promise<Response> {
    return res.status(HttpStatus.OK).json(await this.component.getProductById(params.id));
  }

  @Post('products')
  async createProduct(@Body() data: CreateProductInput, @Res() res: Response): Promise<Response> {
    await this.component.createProduct(data);
    return res.status(HttpStatus.CREATED).json({ message: 'success' });
  }
}
