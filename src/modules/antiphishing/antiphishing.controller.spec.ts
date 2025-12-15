import { Test, TestingModule } from '@nestjs/testing';
import { AntiphishingController } from './antiphishing.controller';

describe('AntiphishingController', () => {
  let controller: AntiphishingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiphishingController],
    }).compile();

    controller = module.get<AntiphishingController>(AntiphishingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
