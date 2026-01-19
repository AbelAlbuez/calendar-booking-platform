import { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { BookingList } from '@/components/BookingList';
import { BookingForm } from '@/components/BookingForm';
import { CalendarStatus } from '@/components/CalendarStatus';
import { apiService } from '@/services/api.service';
import { BookingDto, CreateBookingDto } from '@calendar-booking/shared';

export default function Home() {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Dev login for demo
      handleDevLogin();
    } else {
      loadUserData();
    }
  }, []);

  const handleDevLogin = async () => {
    try {
      const response = await apiService.devLogin(
        'demo@example.com',
        'Demo User',
      );
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
      loadBookings();
    } catch (err) {
      setError('Failed to login');
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      loadBookings();
    } catch (err) {
      localStorage.removeItem('accessToken');
      handleDevLogin();
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookings('Active');
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (dto: CreateBookingDto) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.createBooking(dto);
      await loadBookings();
      setShowForm(false);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.conflictType === 'internal') {
        throw new Error('Time slot conflicts with your existing booking');
      } else if (errorData?.conflictType === 'google_calendar') {
        throw new Error('Time slot conflicts with your Google Calendar');
      } else {
        throw new Error(errorData?.message || 'Failed to create booking');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      setLoading(true);
      await apiService.cancelBooking(id);
      await loadBookings();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.reload();
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Calendar Booking Platform
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <CalendarStatus />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Bookings</Typography>
          <Button
            variant="contained"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            New Booking
          </Button>
        </Box>

        {showForm && (
          <BookingForm
            onSubmit={handleCreateBooking}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        )}

        <BookingList
          bookings={bookings}
          onCancel={handleCancelBooking}
          loading={loading}
        />
      </Container>
    </>
  );
}
