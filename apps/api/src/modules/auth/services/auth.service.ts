import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/services/users.service';
import { OAuth2Client } from 'google-auth-library';
import { AuthResponseDto } from '@calendar-booking/shared';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async googleAuth(idToken: string): Promise<AuthResponseDto> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { sub: googleId, email, name } = payload;

      if (!email || !name) {
        throw new UnauthorizedException('Email and name required');
      }

      // Find or create user
      let user = await this.usersService.findByGoogleId(googleId);

      if (!user) {
        user = await this.usersService.findByEmail(email);
        if (!user) {
          // Create new user
          user = await this.usersService.create({
            email,
            name,
            googleId,
          });
        }
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  /**
   * Development-only login endpoint
   * Creates or finds user without Google OAuth
   */
  async devLogin(email: string, name: string): Promise<AuthResponseDto> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new UnauthorizedException('Dev login not available in production');
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        name,
      });
    }

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: any): AuthResponseDto {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone,
      },
    };
  }
}
