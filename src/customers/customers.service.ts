import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    const newUser = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(newUser);
  }

  findAll() {
    return this.customerRepository.find();
  }

  findOne(id: number) {
    return this.customerRepository.find({
      where: {
        id,
      },
      relations: ['orders'],
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const user = await this.findOne(id);
    return this.customerRepository.save({ ...user, ...updateCustomerDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.customerRepository.remove(user);
  }
}
