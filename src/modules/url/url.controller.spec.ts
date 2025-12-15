import { Test, TestingModule } from '@nestjs/testing';
import { URLController } from './url.controller';

describe('UrlController', () => {
  let controller: URLController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [URLController],
    }).compile();

    controller = module.get<URLController>(URLController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
