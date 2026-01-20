import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { PrismaService } from '@/modules/common/services/prisma.service';
import { ConflictChecker } from '../interfaces/conflict-checker.interface';

@Injectable()
export class GoogleCalendarConflictChecker implements ConflictChecker {
  private readonly logger = new Logger(GoogleCalendarConflictChecker.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async checkConflict(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    try {
      // Get user's Google token
      const token = await this.prisma.googleToken.findUnique({
        where: { userId },
      });

      // If no token, user hasn't connected calendar - no conflict
      if (!token) {
        this.logger.log(`No Google Calendar connected for user ${userId}`);
        return false;
      }

      // Check if token is expired
      if (new Date(token.expiry) < new Date()) {
        this.logger.warn(`Google Calendar token expired for user ${userId}`);
        // Fail-closed: treat expired token as conflict to prevent double-booking
        throw new Error('Google Calendar token expired - please reconnect');
      }

      // Initialize Google Calendar API
      const oauth2Client = new google.auth.OAuth2(
        this.configService.get<string>('GOOGLE_CLIENT_ID'),
        this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      );

      oauth2Client.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // Query calendar for events in a broader time range
      // We'll filter for actual overlaps manually
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      this.logger.log(
        `Google Calendar returned ${events.length} event(s) in range ${start.toISOString()} - ${end.toISOString()}`,
      );

      // Filter events to find actual conflicts
      // Two time ranges overlap if: (start1 < end2) AND (end1 > start2)
      const conflicts = events.filter((event) => {
        // Skip events without start/end times (all-day events, etc.)
        if (!event.start?.dateTime || !event.end?.dateTime) {
          return false;
        }

        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        // Check for overlap: (eventStart < bookingEnd) AND (eventEnd > bookingStart)
        const hasOverlap = eventStart < end && eventEnd > start;

        if (hasOverlap) {
          this.logger.log(
            `Conflict detected: "${event.summary}" (${eventStart.toISOString()} - ${eventEnd.toISOString()}) ` +
            `overlaps with booking (${start.toISOString()} - ${end.toISOString()})`,
          );
        }

        return hasOverlap;
      });

      if (conflicts.length > 0) {
        this.logger.log(
          `Found ${conflicts.length} actual conflict(s) in Google Calendar`,
        );
        return true;
      }

      this.logger.log('No conflicts found in Google Calendar');
      return false;
    } catch (error) {
      this.logger.error(
        `Google Calendar conflict check failed for user ${userId}:`,
        error,
      );
      
      throw new Error(
        'Failed to check Google Calendar availability - booking not allowed',
      );
    }
  }
}