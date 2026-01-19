// User types
export interface UserDto {
  id: string;
  email: string;
  name: string;
  timezone?: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}

// Booking types
export interface CreateBookingDto {
  title: string;
  startUtc: string; // ISO 8601 format
  endUtc: string;   // ISO 8601 format
}

export interface BookingDto {
  id: string;
  userId: string;
  title: string;
  startUtc: string;
  endUtc: string;
  status: 'Active' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
}

// Calendar types
export interface ConnectCalendarDto {
  accessToken: string;
  refreshToken?: string;
  expiry: string; // ISO 8601 format
}

export interface CalendarStatusDto {
  connected: boolean;
  expiry?: string;
}

// Error types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  conflictType?: 'internal' | 'google_calendar';
}
