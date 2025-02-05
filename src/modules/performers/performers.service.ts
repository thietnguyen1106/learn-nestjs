import { Injectable } from '@nestjs/common';
import { CreatePerformerDto } from './dto/create-performer.dto';
import { UpdatePerformerDto } from './dto/update-performer.dto';

@Injectable()
export class PerformersService {
  create(createPerformerDto: CreatePerformerDto) {
    return 'This action adds a new performer';
  }

  findAll() {
    return `This action returns all performers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} performer`;
  }

  update(id: number, updatePerformerDto: UpdatePerformerDto) {
    return `This action updates a #${id} performer`;
  }

  remove(id: number) {
    return `This action removes a #${id} performer`;
  }
}
