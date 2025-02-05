import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PerformersService } from './performers.service';
import { CreatePerformerDto } from './dto/create-performer.dto';
import { UpdatePerformerDto } from './dto/update-performer.dto';

@Controller('performers')
export class PerformersController {
  constructor(private readonly performersService: PerformersService) {}

  @Post()
  create(@Body() createPerformerDto: CreatePerformerDto) {
    return this.performersService.create(createPerformerDto);
  }

  @Get()
  findAll() {
    return this.performersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePerformerDto: UpdatePerformerDto,
  ) {
    return this.performersService.update(+id, updatePerformerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.performersService.remove(+id);
  }
}
