import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { dataSourceOptions } from 'db/data-source';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { GenderModule } from './gender/gender.module';
import { BaseCategoriesModule } from './base-categories/base-categories.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CustomersModule,
    OrdersModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    GenderModule,
    BaseCategoriesModule,
    SearchModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
