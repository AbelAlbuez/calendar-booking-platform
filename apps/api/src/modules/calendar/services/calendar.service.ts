import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/common/services/prisma.service';
import { CalendarStatusDto } from '@calendar-booking/shared';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async connectCalendar(
    userId: string,
    accessToken: string,
    refreshToken: string | undefined,
    expiry: string,
  ): Promise<void> {
    await this.prisma.googleToken.upsert({
      where: { userId },
      create: {
        userId,
        accessToken,
        refreshToken: refreshToken || '',
        expiry: new Date(expiry),
        scope: 'https://www.googleapis.com/auth/calendar.events',
      },
      update: {
        accessToken,
        refreshToken: refreshToken || undefined,
        expiry: new Date(expiry),
        scope: 'https://www.googleapis.com/auth/calendar.events',
      },
    });
  }

  async getCalendarStatus(userId: string): Promise<CalendarStatusDto> {
    const token = await this.prisma.googleToken.findUnique({
      where: { userId },
    });

    if (!token) {
      return { connected: false };
    }

    return {
      connected: true,
      expiry: token.expiry.toISOString(),
    };
  }

  async disconnectCalendar(userId: string): Promise<void> {
    await this.prisma.googleToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Create an event in Google Calendar
   */
  async createGoogleCalendarEvent(
    userId: string,
    title: string,
    startUtc: Date,
    endUtc: Date,
  ): Promise<string | null> {
    try {
      // Get user's Google token
      const token = await this.prisma.googleToken.findUnique({
        where: { userId },
      });

      if (!token) {
        // User doesn't have calendar connected, skip event creation
        return null;
      }

      // Check if token is expired
      if (new Date(token.expiry) < new Date()) {
        console.warn(`Google Calendar token expired for user ${userId}`);
        return null;
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

      // Create the event
      const event = {
        summary: title,
        description: 'Created by Calendar Booking Platform',
        start: {
          dateTime: startUtc.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endUtc.toISOString(),
          timeZone: 'UTC',
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      console.log(
        `Created Google Calendar event: ${response.data.id} for user ${userId}`,
      );

      return response.data.id || null;
    } catch (error) {
      console.error(
        `Failed to create Google Calendar event for user ${userId}:`,
        error,
      );
      // Don't throw error - event creation is optional
      return null;
    }
  }

  /**
   * Delete an event from Google Calendar
   */
  async deleteGoogleCalendarEvent(
    userId: string,
    eventId: string,
  ): Promise<void> {
    try {
      const token = await this.prisma.googleToken.findUnique({
        where: { userId },
      });

      if (!token || !eventId) {
        return;
      }

      const oauth2Client = new google.auth.OAuth2(
        this.configService.get<string>('GOOGLE_CLIENT_ID'),
        this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      );

      oauth2Client.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      console.log(
        `Deleted Google Calendar event: ${eventId} for user ${userId}`,
      );
    } catch (error) {
      console.error(
        `Failed to delete Google Calendar event ${eventId}:`,
        error,
      );
      // Don't throw - deletion is optional
    }
  }
}
