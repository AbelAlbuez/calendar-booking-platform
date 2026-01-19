import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { GoogleAuthDto, DevLoginDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '@/modules/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.googleAuth(dto.idToken);
  }

  @Post('dev-login')
  async devLogin(@Body() dto: DevLoginDto) {
    return this.authService.devLogin(dto.email, dto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      timezone: user.timezone,
    };
  }
}
