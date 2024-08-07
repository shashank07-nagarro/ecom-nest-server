import { Injectable } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { Gender } from './entities/gender.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
  ) {}

  create(createGenderDto: CreateGenderDto) {
    const newUser = this.genderRepository.create(createGenderDto);
    return this.genderRepository.save(newUser);
  }

  findAll() {
    return this.genderRepository.find();
  }

  findOne(id: number) {
    return this.genderRepository.findOneBy({ id });
  }

  async update(id: number, updateGenderDto: UpdateGenderDto) {
    const user = await this.genderRepository.findOneBy({ id });
    return this.genderRepository.save({ ...user, ...updateGenderDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.genderRepository.remove(user);
  }
}
