import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/auth.schema';
import {
  AdminAction,
  AdminActionDocument,
} from 'src/modules/admin/schemas/admin-action.schema';
import { generateTimeAgo } from 'src/modules/admin/utils/time-ago';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AdminAction.name)
    private actionModel: Model<AdminActionDocument>,
    private jwt: JwtService,
  ) {}

  async register(body: any) {
    const hashed = await bcrypt.hash(body.password, 10);

    return this.userModel.create({
      name: body.name,
      email: body.email,
      password: hashed,
      role: body.role || 'User',
      status: body.status || 'active',
    });
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 5 * 60 * 1000);

    await this.userModel.updateOne(
      { _id: user._id },
      { otp, otpExpiration: expiration },
    );

    return {
      message: 'OTP sent',
      userId: user._id,
    };
  }

  async verifyOtp(userId: string, otp: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    if (user.otp !== otp) {
      throw new UnauthorizedException('OTP salah');
    }

    if (user.otpExpiration < new Date()) {
      throw new UnauthorizedException('OTP kedaluwarsa');
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwt.sign(payload),
      user: payload,
    };
  }

  // ===============================
  // CRUD UNTUK USER MANAGEMENT
  // ===============================

  async findAll() {
    return this.userModel.find().select('-password -otp -otpExpiration');
  }

  async create(body: any) {
    const hashed = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: hashed,
      role: body.role || 'User',
      status: body.status || 'active',
    });

    await this.actionModel.create({
      action: `Menambahkan user ${user.email}`,
      admin: 'Admin',
      timeAgo: generateTimeAgo(new Date()),
    });

    return user;
  }

  async update(id: string, body: any) {
    const oldUser = await this.userModel.findById(id);

    const updated = await this.userModel.findByIdAndUpdate(
      id,
      {
        name: body.name,
        email: body.email,
        role: body.role,
        status: body.status,
        ...(body.password && {
          password: await bcrypt.hash(body.password, 10),
        }),
      },
      { new: true },
    );

    await this.actionModel.create({
      action: `Mengubah user ${oldUser?.email}`,
      admin: 'Admin',
      timeAgo: generateTimeAgo(new Date()),
    });

    return updated;
  }

  async delete(id: string) {
  const user = await this.userModel.findById(id);

  await this.userModel.findByIdAndDelete(id);

  await this.actionModel.create({
    action: `Menghapus user ${user?.email}`,
    admin: 'Admin',
    timeAgo: generateTimeAgo(new Date()),
  });

  return { deleted: true };
}

}
