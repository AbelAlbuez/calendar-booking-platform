import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '@/modules/common/services/prisma.service';
import { InternalBookingsConflictChecker } from './internal-bookings-conflict-checker.service';
import { CONFLICT_CHECKER } from '@/modules/calendar/interfaces/conflict-checker.interface';
import { CalendarService } from '@/modules/calendar/services/calendar.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaService: PrismaService;
  let internalConflictChecker: InternalBookingsConflictChecker;
  let googleConflictChecker: any;
  let calendarService: CalendarService;

  const mockPrismaService = {
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockInternalConflictChecker = {
    checkConflict: jest.fn(),
  };

  const mockGoogleConflictChecker = {
    checkConflict: jest.fn(),
  };

  const mockCalendarService = {
    createGoogleCalendarEvent: jest.fn(),
    deleteGoogleCalendarEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: InternalBookingsConflictChecker,
          useValue: mockInternalConflictChecker,
        },
        {
          provide: CONFLICT_CHECKER,
          useValue: mockGoogleConflictChecker,
        },
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);
    internalConflictChecker = module.get<InternalBookingsConflictChecker>(
      InternalBookingsConflictChecker,
    );
    googleConflictChecker = module.get(CONFLICT_CHECKER);
    calendarService = module.get<CalendarService>(CalendarService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    const userId = 'user-123';
    const title = 'Team Meeting';
    // Use dates that are always in the future (1 day from now)
    const getFutureDates = () => {
      const now = new Date();
      const futureStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now
      const futureEnd = new Date(futureStart.getTime() + 60 * 60 * 1000); // 1 hour later
      return {
        futureStart: futureStart.toISOString(),
        futureEnd: futureEnd.toISOString(),
      };
    };

    it('should create booking when no conflicts exist', async () => {
      const { futureStart, futureEnd } = getFutureDates();
      // Mock: no conflicts
      mockInternalConflictChecker.checkConflict.mockResolvedValue(false);
      mockGoogleConflictChecker.checkConflict.mockResolvedValue(false);
      mockCalendarService.createGoogleCalendarEvent.mockResolvedValue(null);

      const mockBooking = {
        id: 'booking-123',
        userId,
        title,
        startUtc: new Date(futureStart),
        endUtc: new Date(futureEnd),
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.booking.create.mockResolvedValue(mockBooking);

      const result = await service.createBooking(
        userId,
        title,
        futureStart,
        futureEnd,
      );

      expect(result).toEqual(mockBooking);
      expect(mockInternalConflictChecker.checkConflict).toHaveBeenCalledWith(
        userId,
        new Date(futureStart),
        new Date(futureEnd),
      );
      expect(mockGoogleConflictChecker.checkConflict).toHaveBeenCalledWith(
        userId,
        new Date(futureStart),
        new Date(futureEnd),
      );
      expect(mockPrismaService.booking.create).toHaveBeenCalled();
      expect(mockCalendarService.createGoogleCalendarEvent).toHaveBeenCalledWith(
        userId,
        title,
        new Date(futureStart),
        new Date(futureEnd),
      );
    });

    it('should reject booking when internal conflict exists', async () => {
      const { futureStart, futureEnd } = getFutureDates();
      // Mock: internal conflict found
      mockInternalConflictChecker.checkConflict.mockResolvedValue(true);

      await expect(
        service.createBooking(userId, title, futureStart, futureEnd),
      ).rejects.toThrow(ConflictException);

      // Should not check Google Calendar if internal conflict found
      expect(mockGoogleConflictChecker.checkConflict).not.toHaveBeenCalled();
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking when Google Calendar conflict exists', async () => {
      const { futureStart, futureEnd } = getFutureDates();
      // Mock: no internal conflict, but Google Calendar conflict
      mockInternalConflictChecker.checkConflict.mockResolvedValue(false);
      mockGoogleConflictChecker.checkConflict.mockResolvedValue(true);

      await expect(
        service.createBooking(userId, title, futureStart, futureEnd),
      ).rejects.toThrow(ConflictException);

      expect(mockInternalConflictChecker.checkConflict).toHaveBeenCalled();
      expect(mockGoogleConflictChecker.checkConflict).toHaveBeenCalled();
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking when Google Calendar check fails (fail-closed)', async () => {
      const { futureStart, futureEnd } = getFutureDates();
      // Mock: internal check passes, Google check fails
      mockInternalConflictChecker.checkConflict.mockResolvedValue(false);
      mockGoogleConflictChecker.checkConflict.mockRejectedValue(
        new Error('Google API timeout'),
      );

      await expect(
        service.createBooking(userId, title, futureStart, futureEnd),
      ).rejects.toThrow(ConflictException);

      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking with invalid time interval (start >= end)', async () => {
      const { futureStart } = getFutureDates();
      // Use futureStart as end and a later time as start (invalid)
      const invalidStart = new Date(new Date(futureStart).getTime() + 60 * 60 * 1000).toISOString();
      const invalidEnd = futureStart; // end is before start

      await expect(
        service.createBooking(userId, title, invalidStart, invalidEnd),
      ).rejects.toThrow(BadRequestException);

      expect(mockInternalConflictChecker.checkConflict).not.toHaveBeenCalled();
      expect(mockGoogleConflictChecker.checkConflict).not.toHaveBeenCalled();
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });

    it('should reject booking in the past', async () => {
      const pastStart = new Date('2020-01-20T14:00:00Z').toISOString();
      const pastEnd = new Date('2020-01-20T15:00:00Z').toISOString();

      await expect(
        service.createBooking(userId, title, pastStart, pastEnd),
      ).rejects.toThrow(BadRequestException);

      expect(mockInternalConflictChecker.checkConflict).not.toHaveBeenCalled();
      expect(mockPrismaService.booking.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings with default status Active', async () => {
      const mockBookings = [
        {
          id: 'booking-1',
          userId: 'user-123',
          title: 'Meeting 1',
          startUtc: new Date('2025-12-20T10:00:00Z'),
          endUtc: new Date('2025-12-20T11:00:00Z'),
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(mockBookings);

      const result = await service.getUserBookings('user-123');

      expect(result).toEqual(mockBookings);
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: 'Active',
        },
        orderBy: {
          startUtc: 'asc',
        },
      });
    });
  });

  describe('cancelBooking', () => {
    it('should successfully cancel an active booking', async () => {
      const mockBooking = {
        id: 'booking-123',
        userId: 'user-123',
        title: 'Meeting',
        startUtc: new Date('2025-12-20T10:00:00Z'),
        endUtc: new Date('2025-12-20T11:00:00Z'),
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
        googleEventId: null,
      };

      const cancelledBooking = { ...mockBooking, status: 'Cancelled' };

      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.booking.update.mockResolvedValue(cancelledBooking);
      mockCalendarService.deleteGoogleCalendarEvent.mockResolvedValue(undefined);

      const result = await service.cancelBooking('user-123', 'booking-123');

      expect(result.status).toBe('Cancelled');
      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-123' },
        data: { status: 'Cancelled' },
      });
    });

    it('should throw error when booking already cancelled', async () => {
      const mockBooking = {
        id: 'booking-123',
        userId: 'user-123',
        title: 'Meeting',
        startUtc: new Date('2025-12-20T10:00:00Z'),
        endUtc: new Date('2025-12-20T11:00:00Z'),
        status: 'Cancelled',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      await expect(
        service.cancelBooking('user-123', 'booking-123'),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.booking.update).not.toHaveBeenCalled();
    });
  });
});
