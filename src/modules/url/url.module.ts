import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { URLController } from './url.controller';
import { URLService } from './url.service';
import { ReportedURL, ReportedURLSchema } from './schemas/reported-url.schema';
import { BlockedURL, BlockedURLSchema } from './schemas/blocked-url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportedURL.name, schema: ReportedURLSchema },
      { name: BlockedURL.name, schema: BlockedURLSchema },
    ]),
  ],
  controllers: [URLController],
  providers: [URLService],
})
export class URLModule {}
