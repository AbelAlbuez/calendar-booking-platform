import axios, { AxiosInstance } from 'axios';
import {
  BookingDto,
  CreateBookingDto,
  AuthResponseDto,
  CalendarStatusDto,
  ConnectCalendarDto,
} from '@calendar-booking/shared';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async devLogin(email: string, name: string): Promise<AuthResponseDto> {
    const { data } = await this.client.post<AuthResponseDto>('/auth/dev-login', {
      email,
      name,
    });
    return data;
  }

  async getCurrentUser() {
    const { data } = await this.client.get('/auth/me');
    return data;
  }

  // Bookings
  async createBooking(dto: CreateBookingDto): Promise<BookingDto> {
    const { data } = await this.client.post<BookingDto>('/bookings', dto);
    return data;
  }

  async getBookings(status?: 'Active' | 'Cancelled'): Promise<BookingDto[]> {
    const { data } = await this.client.get<BookingDto[]>('/bookings', {
      params: { status },
    });
    return data;
  }

  async cancelBooking(id: string): Promise<BookingDto> {
    const { data } = await this.client.delete<BookingDto>(`/bookings/${id}`);
    return data;
  }

  // Calendar
  async connectCalendar(dto: ConnectCalendarDto): Promise<void> {
    await this.client.post('/calendar/connect', dto);
  }

  async getCalendarStatus(): Promise<CalendarStatusDto> {
    const { data } = await this.client.get<CalendarStatusDto>('/calendar/status');
    return data;
  }
}

export const apiService = new ApiService();
