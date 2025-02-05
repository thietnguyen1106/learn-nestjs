import { Test, TestingModule } from '@nestjs/testing';
import { PerformersService } from './performers.service';

describe('PerformersService', () => {
  let service: PerformersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformersService],
    }).compile();

    service = module.get<PerformersService>(PerformersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
