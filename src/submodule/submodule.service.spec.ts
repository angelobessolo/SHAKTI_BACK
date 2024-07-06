import { Test, TestingModule } from '@nestjs/testing';
import { SubmoduleService } from './submodule.service';

describe('SubmoduleService', () => {
  let service: SubmoduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmoduleService],
    }).compile();

    service = module.get<SubmoduleService>(SubmoduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
