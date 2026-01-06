import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
  }

  @Public()
  @Get('auth/social/:provider')
  async getSocialAuthUrl(
    @Param('provider') provider: 'google' | 'github' | 'facebook',
    @Query('redirectTo') redirectTo?: string,
  ) {
    return this.authService.getSocialAuthUrl(provider, redirectTo);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
}
