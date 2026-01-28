import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
      },
      session: {
        access_token,
        token_type: 'bearer',
        expires_in: 3600,
      },
    };
  }

  async signup(email: string, password: string, name?: string) {
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
    });

    const savedUser = await user.save();

    const payload = { sub: savedUser._id.toString(), email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        language: savedUser.language,
      },
      session: {
        access_token,
        token_type: 'bearer',
        expires_in: 3600,
      },
    };
  }

  async getSocialAuthUrl(
    provider: 'google' | 'github' | 'facebook',
    redirectTo?: string,
  ) {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const urls = {
      google: `${baseUrl}/auth/google`,
      github: `${baseUrl}/auth/github`,
      facebook: `${baseUrl}/auth/facebook`,
    };

    if (!urls[provider]) {
      throw new BadRequestException(`Unsupported provider: ${provider}`);
    }

    return { url: urls[provider] };
  }

  async handleOAuthLogin(oauthUser: any) {
    if (!oauthUser) {
      throw new BadRequestException('Invalid OAuth user data');
    }

    // Si pas d'email, générer un email fictif basé sur le provider
    if (!oauthUser.email) {
      oauthUser.email = `${oauthUser.provider}_${oauthUser.providerId}@oauth.local`;
    }

    // Check if user exists
    let user = await this.userModel
      .findOne({
        $or: [
          { email: oauthUser.email },
          {
            provider: oauthUser.provider,
            providerId: oauthUser.providerId,
          },
        ],
      })
      .exec();

    if (!user) {
      // Create new user from OAuth data
      user = new this.userModel({
        email: oauthUser.email,
        name: oauthUser.name || oauthUser.email.split('@')[0],
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
        picture: oauthUser.picture,
        // No password for OAuth users
      });
      await user.save();
    } else {
      // Update user info if needed
      if (!user.provider && oauthUser.provider) {
        user.provider = oauthUser.provider;
        user.providerId = oauthUser.providerId;
      }
      if (oauthUser.picture && !user.picture) {
        user.picture = oauthUser.picture;
      }
      await user.save();
    }

    // Generate JWT token
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        picture: user.picture,
      },
      session: {
        access_token,
        token_type: 'bearer',
        expires_in: 3600,
      },
    };
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      language: user.language,
    };
  }
}
