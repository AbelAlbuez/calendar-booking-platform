import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/common/services/prisma.service';
import { hasTimeOverlap } from '@calendar-booking/shared';
import { ConflictChecker } from '@/modules/calendar/interfaces/conflict-checker.interface';

@Injectable()
export class InternalBookingsConflictChecker implements ConflictChecker {
  constructor(private prisma: PrismaService) {}

  async checkConflict(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    // Find all active bookings for this user
    const bookings = await this.prisma.booking.findMany({
      where: {
        userId,
        status: 'Active',
      },
    });

    // Check for overlaps with existing bookings
    for (const booking of bookings) {
      if (hasTimeOverlap(start, end, booking.startUtc, booking.endUtc)) {
        return true;
      }
    }

    return false;
  }
}
