import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

export class LoginDto {
  email: string;
  password: string;
}

export class SignupDto {
  email: string;
  password: string;
  name?: string;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
  }

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
