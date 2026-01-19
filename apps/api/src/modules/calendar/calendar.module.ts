import { Module } from '@nestjs/common';
import { CalendarController } from './controllers/calendar.controller';
import { CalendarService } from './services/calendar.service';
import { GoogleCalendarConflictChecker } from './services/google-calendar-conflict-checker.service';
import { CONFLICT_CHECKER } from './interfaces/conflict-checker.interface';

@Module({
  controllers: [CalendarController],
  providers: [
    CalendarService,
    GoogleCalendarConflictChecker,
    {
      provide: CONFLICT_CHECKER,
      useClass: GoogleCalendarConflictChecker,
    },
  ],
  exports: [CalendarService, CONFLICT_CHECKER],
})
export class CalendarModule {}
