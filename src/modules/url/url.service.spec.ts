import { Test, TestingModule } from '@nestjs/testing';
import { URLService } from './url.service';

describe('UrlService', () => {
  let service: URLService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [URLService],
    }).compile();

    service = module.get<URLService>(URLService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
