import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { BookingsService } from './services/bookings.service';
import { InternalBookingsConflictChecker } from './services/internal-bookings-conflict-checker.service';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [CalendarModule],
  controllers: [BookingsController],
  providers: [BookingsService, InternalBookingsConflictChecker],
  exports: [BookingsService],
})
export class BookingsModule {}
