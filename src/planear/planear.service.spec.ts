import { Test, TestingModule } from '@nestjs/testing';
import { PlanearService } from './planear.service';

describe('PlanearService', () => {
  let service: PlanearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanearService],
    }).compile();

    service = module.get<PlanearService>(PlanearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
