import { Test, TestingModule } from '@nestjs/testing';
import { SubmoduleController } from './submodule.controller';
import { SubmoduleService } from './submodule.service';

describe('SubmoduleController', () => {
  let controller: SubmoduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmoduleController],
      providers: [SubmoduleService],
    }).compile();

    controller = module.get<SubmoduleController>(SubmoduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
