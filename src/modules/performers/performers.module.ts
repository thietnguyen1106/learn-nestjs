import { Module } from '@nestjs/common';
import { PerformersService } from './performers.service';
import { PerformersController } from './performers.controller';

@Module({
  controllers: [PerformersController],
  providers: [PerformersService],
})
export class PerformersModule {}
