import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { BookingDto } from '@calendar-booking/shared';

interface BookingListProps {
  bookings: BookingDto[];
  onCancel: (id: string) => void;
  loading: boolean;
}

export function BookingList({ bookings, onCancel, loading }: BookingListProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);

  const handleCancelClick = (booking: BookingDto) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      onCancel(selectedBooking.id);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleCloseCancelDialog = () => {
    if (!loading) {
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (start: string, end: string) => {
    const duration = (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isUpcoming = (start: string) => {
    return new Date(start) > new Date();
  };

  if (bookings.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: 'background.default',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No bookings yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first booking to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        {bookings.map((booking) => {
          const upcoming = isUpcoming(booking.startUtc);
          
          return (
            <Card
              key={booking.id}
              elevation={2}
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {/* Title and Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {booking.title}
                      </Typography>
                      <Chip
                        label={booking.status}
                        size="small"
                        color={booking.status === 'Active' ? 'success' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                      {booking.status === 'Active' && upcoming && (
                        <Chip
                          label="Upcoming"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {/* Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(booking.startUtc)}
                      </Typography>
                    </Box>

                    {/* Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(booking.startUtc)} - {formatTime(booking.endUtc)}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1, fontWeight: 500 }}
                        >
                          ({getDuration(booking.startUtc, booking.endUtc)})
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Cancel Button */}
                  {booking.status === 'Active' && (
                    <IconButton
                      color="error"
                      onClick={() => handleCancelClick(booking)}
                      disabled={loading}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.lighter',
                        },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          Cancel Booking?
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to cancel this booking?
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking Details:
                </Typography>
                <Typography variant="body2">
                  <strong>Title:</strong> {selectedBooking.title}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(selectedBooking.startUtc)}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {formatTime(selectedBooking.startUtc)} - {formatTime(selectedBooking.endUtc)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="warning.main">
                This action cannot be undone.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseCancelDialog} disabled={loading} variant="outlined">
            Keep Booking
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
