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

      // Query calendar for events in the time range
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      // Check if any events exist in this time range
      if (events.length > 0) {
        this.logger.log(
          `Found ${events.length} Google Calendar event(s) conflicting with ${start} - ${end}`,
        );
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Google Calendar conflict check failed for user ${userId}:`,
        error,
      );
      // Fail-closed: treat API errors as conflicts
      throw new Error(
        'Failed to check Google Calendar availability - booking not allowed',
      );
    }
  }
}
