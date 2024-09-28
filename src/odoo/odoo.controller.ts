import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OdooService } from './odoo.service';

@Controller('odoo')
export class OdooController {
  constructor(private readonly odooService: OdooService) {}

 
  @Get('products')
    async getProducts() {
        return this.odooService.getProducts();
    }

    @Post()
    async createProduct() {
      const result = await this.odooService.createProduct();
      return result;
    }
}
