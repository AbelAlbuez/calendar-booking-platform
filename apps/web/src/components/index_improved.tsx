import { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Alert,
  Fab,
  Snackbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
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
      setSuccessMessage('Booking created successfully!');
      setShowForm(false);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.conflictType === 'internal') {
        throw new Error('⚠️ Time slot conflicts with your existing booking');
      } else if (errorData?.conflictType === 'google_calendar') {
        throw new Error('⚠️ Time slot conflicts with your Google Calendar');
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
      setSuccessMessage('Booking cancelled successfully');
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            📅 Calendar Booking
          </Typography>
          
          <Chip
            label={`${bookings.filter(b => b.status === 'Active').length} Active`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
          />

          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={anchorEl ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Global Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Calendar Status */}
        <Box sx={{ mb: 4 }}>
          <CalendarStatus />
        </Box>

        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h4" fontWeight="bold">
            My Bookings
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadBookings}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Box>

        {/* Booking List */}
        <BookingList
          bookings={bookings}
          onCancel={handleCancelBooking}
          loading={loading}
        />
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add booking"
        onClick={() => setShowForm(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Booking Form Dialog */}
      <BookingForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateBooking}
        loading={loading}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage(null)} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
