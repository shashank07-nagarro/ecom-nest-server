import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const newUser = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(newUser);
  }

  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: number) {
    return this.orderRepository.find({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateOrderDto) {
    const user = await this.findOne(id);
    return this.orderRepository.save({ ...user, ...updateCustomerDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.orderRepository.remove(user);
  }
}
