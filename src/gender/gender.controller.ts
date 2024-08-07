import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Gender } from './entities/gender.entity';

@Controller('gender')
@ApiTags('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Post()
  @ApiCreatedResponse({ type: Gender })
  create(@Body() createGenderDto: CreateGenderDto) {
    return this.genderService.create(createGenderDto);
  }

  @Get()
  @ApiOkResponse({ type: Gender, isArray: true })
  findAll() {
    return this.genderService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Gender })
  findOne(@Param('id') id: string) {
    return this.genderService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Gender })
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.genderService.update(+id, updateGenderDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Gender })
  remove(@Param('id') id: string) {
    return this.genderService.remove(+id);
  }
}
