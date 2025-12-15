import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminAction, AdminActionSchema } from 'src/modules/admin/schemas/admin-action.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
    { name: AdminAction.name, schema: AdminActionSchema }
    ]),
    JwtModule.register({
      secret: 'SECRETKEY123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
