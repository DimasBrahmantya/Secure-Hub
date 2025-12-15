import { Test, TestingModule } from '@nestjs/testing';
import { AntiPhishingService } from './antiphishing.service';

describe('AntiphishingService', () => {
  let service: AntiPhishingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiPhishingService],
    }).compile();

    service = module.get<AntiPhishingService>(AntiPhishingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
