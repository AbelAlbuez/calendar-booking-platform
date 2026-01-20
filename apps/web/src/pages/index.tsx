// apps/web/src/pages/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Fab,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BookingList } from '@/components/BookingList';
import { BookingForm } from '@/components/BookingForm';
import { CalendarStatus } from '@/components/CalendarStatus';
import { apiService } from '@/services/api.service';
import { BookingDto, CreateBookingDto } from '@calendar-booking/shared';

export default function Home() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      loadBookings();
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookings('Active');
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (dto: CreateBookingDto) => {
    try {
      const newBooking = await apiService.createBooking(dto);
      setBookings([...bookings, newBooking]);
      setShowForm(false);
      setSnackbar({
        open: true,
        message: 'Booking created successfully!',
        severity: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      throw new Error(errorMessage);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await apiService.cancelBooking(id);
      setBookings(bookings.filter((b) => b.id !== id));
      setSnackbar({
        open: true,
        message: 'Booking cancelled successfully!',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to cancel booking',
        severity: 'error',
      });
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const activeBookingsCount = bookings.filter(b => b.status === 'Active').length;

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📅 Calendar Booking
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {activeBookingsCount} Active
          </Typography>
          <IconButton onClick={handleMenuClick} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <CalendarStatus />

        <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            My Bookings
          </Typography>
        </Box>

        <BookingList
          bookings={bookings}
          onCancel={handleCancelBooking}
          onRefresh={loadBookings}
          loading={loading}
        />

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setShowForm(true)}
        >
          <AddIcon />
        </Fab>

        <BookingForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateBooking}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Container>
    </Box>
  );
}