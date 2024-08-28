import { Test, TestingModule } from '@nestjs/testing';
import { PlanearController } from './planear.controller';
import { PlanearService } from './planear.service';

describe('PlanearController', () => {
  let controller: PlanearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanearController],
      providers: [PlanearService],
    }).compile();

    controller = module.get<PlanearController>(PlanearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
