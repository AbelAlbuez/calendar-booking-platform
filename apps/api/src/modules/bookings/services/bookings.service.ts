import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '@/modules/common/services/prisma.service';
import { Booking } from '@prisma/client';
import { validateTimeInterval, isPast } from '@calendar-booking/shared';
import { InternalBookingsConflictChecker } from './internal-bookings-conflict-checker.service';
import {
  ConflictChecker,
  CONFLICT_CHECKER,
} from '@/modules/calendar/interfaces/conflict-checker.interface';
import { CalendarService } from '@/modules/calendar/services/calendar.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private internalConflictChecker: InternalBookingsConflictChecker,
    @Inject(CONFLICT_CHECKER)
    private googleConflictChecker: ConflictChecker,
    private calendarService: CalendarService,
  ) {}

  async createBooking(
    userId: string,
    title: string,
    startUtc: string,
    endUtc: string,
  ): Promise<Booking> {
    const start = new Date(startUtc);
    const end = new Date(endUtc);

    // Validate time interval
    try {
      validateTimeInterval(start, end);
    } catch (error) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check if booking is in the past
    if (isPast(start)) {
      throw new BadRequestException('Cannot book time slots in the past');
    }

    // Check internal bookings for conflicts (fast)
    const hasInternalConflict = await this.internalConflictChecker.checkConflict(
      userId,
      start,
      end,
    );

    if (hasInternalConflict) {
      throw new ConflictException({
        message: 'Time slot conflicts with existing booking',
        conflictType: 'internal',
      });
    }

    // Check Google Calendar for conflicts (external, may fail)
    try {
      const hasGoogleConflict = await this.googleConflictChecker.checkConflict(
        userId,
        start,
        end,
      );

      if (hasGoogleConflict) {
        throw new ConflictException({
          message: 'Time slot conflicts with Google Calendar event',
          conflictType: 'google_calendar',
        });
      }
    } catch (error) {
      // Fail-closed policy: if Google Calendar check fails, reject booking
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new ConflictException({
        message: error.message || 'Failed to verify Google Calendar availability',
        conflictType: 'google_calendar',
      });
    }

    // Create booking in database (no conflicts)
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        title,
        startUtc: start,
        endUtc: end,
        status: 'Active',
      },
    });

    // Try to create event in Google Calendar (optional, don't fail if it doesn't work)
    try {
      const googleEventId = await this.calendarService.createGoogleCalendarEvent(
        userId,
        title,
        start,
        end,
      );

      // Update booking with Google event ID if created
      if (googleEventId) {
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { googleEventId },
        });
      }
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
      // Don't throw - booking is already created, Google sync is optional
    }

    return booking;
  }

  async getUserBookings(
    userId: string,
    status: 'Active' | 'Cancelled' = 'Active',
  ): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        userId,
        status,
      },
      orderBy: {
        startUtc: 'asc',
      },
    });
  }

  async cancelBooking(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'Cancelled') {
      throw new BadRequestException('Booking already cancelled');
    }

    // Try to delete from Google Calendar if it was synced
    if (booking.googleEventId) {
      try {
        await this.calendarService.deleteGoogleCalendarEvent(
          userId,
          booking.googleEventId,
        );
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error);
        // Don't throw - continue with cancellation even if Google delete fails
      }
    }

    // Update booking status to Cancelled
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'Cancelled' },
    });
  }
}
