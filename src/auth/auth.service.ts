import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async logout() {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Logout failed');
    }

    return { message: 'Logged out successfully' };
  }
}

