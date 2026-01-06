import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async login(email: string, password: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async signup(email: string, password: string, name?: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async getSocialAuthUrl(
    provider: 'google' | 'github' | 'facebook',
    redirectTo?: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // Get redirect URL from config or use default
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = redirectTo || `${frontendUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      url: data.url,
    };
  }

  async logout() {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Logout failed');
    }

    return { message: 'Logged out successfully' };
  }
}
