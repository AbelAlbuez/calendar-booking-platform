import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { BookingDto } from '@calendar-booking/shared';

interface BookingListProps {
  bookings: BookingDto[];
  onCancel: (id: string) => void;
  loading: boolean;
}

export function BookingList({ bookings, onCancel, loading }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="textSecondary">
            No bookings yet. Create your first booking!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {booking.title}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  {new Date(booking.startUtc).toLocaleString()} -{' '}
                  {new Date(booking.endUtc).toLocaleString()}
                </Typography>
                <Chip
                  label={booking.status}
                  size="small"
                  color={booking.status === 'Active' ? 'success' : 'default'}
                />
              </Box>
              {booking.status === 'Active' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => onCancel(booking.id)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
