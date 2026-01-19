import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { JwtAuthGuard } from '@/modules/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @CurrentUser() user: User,
    @Body() dto: CreateBookingDto,
  ) {
    const booking = await this.bookingsService.createBooking(
      user.id,
      dto.title,
      dto.startUtc,
      dto.endUtc,
    );

    return {
      id: booking.id,
      userId: booking.userId,
      title: booking.title,
      startUtc: booking.startUtc.toISOString(),
      endUtc: booking.endUtc.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  @Get()
  async getBookings(
    @CurrentUser() user: User,
    @Query('status') status?: 'Active' | 'Cancelled',
  ) {
    const bookings = await this.bookingsService.getUserBookings(
      user.id,
      status,
    );

    return bookings.map((booking) => ({
      id: booking.id,
      userId: booking.userId,
      title: booking.title,
      startUtc: booking.startUtc.toISOString(),
      endUtc: booking.endUtc.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));
  }

  @Delete(':id')
  async cancelBooking(
    @CurrentUser() user: User,
    @Param('id') bookingId: string,
  ) {
    const booking = await this.bookingsService.cancelBooking(
      user.id,
      bookingId,
    );

    return {
      id: booking.id,
      userId: booking.userId,
      title: booking.title,
      startUtc: booking.startUtc.toISOString(),
      endUtc: booking.endUtc.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }
}
