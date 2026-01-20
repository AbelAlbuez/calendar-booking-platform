import { Controller, Post, Get, Delete, Body, UseGuards } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { ConnectCalendarDto } from '../dto/calendar.dto';
import { JwtAuthGuard } from '@/modules/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('connect')
  async connectCalendar(
    @CurrentUser() user: User,
    @Body() dto: ConnectCalendarDto,
  ) {
    await this.calendarService.connectCalendar(
      user.id,
      dto.accessToken,
      dto.refreshToken,
      dto.expiry,
    );

    return { message: 'Calendar connected successfully' };
  }

  @Get('status')
  async getStatus(@CurrentUser() user: User) {
    return this.calendarService.getCalendarStatus(user.id);
  }

  @Delete('disconnect')
  async disconnectCalendar(@CurrentUser() user: User) {
    await this.calendarService.disconnectCalendar(user.id);
    return { message: 'Calendar disconnected successfully' };
  }
}