import { Test, TestingModule } from '@nestjs/testing';
import { PerformersController } from './performers.controller';
import { PerformersService } from './performers.service';

describe('PerformersController', () => {
  let controller: PerformersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformersController],
      providers: [PerformersService],
    }).compile();

    controller = module.get<PerformersController>(PerformersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
