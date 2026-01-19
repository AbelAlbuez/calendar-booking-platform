import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CreateBookingDto } from '@calendar-booking/shared';

interface BookingFormProps {
  onSubmit: (dto: CreateBookingDto) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function BookingForm({ onSubmit, onCancel, loading }: BookingFormProps) {
  const [title, setTitle] = useState('');
  const [startUtc, setStartUtc] = useState('');
  const [endUtc, setEndUtc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!startUtc || !endUtc) {
      setError('Start and end times are required');
      return;
    }

    const start = new Date(startUtc);
    const end = new Date(endUtc);

    if (start >= end) {
      setError('End time must be after start time');
      return;
    }

    if (start < new Date()) {
      setError('Cannot book time slots in the past');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={loading}
          />

          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={startUtc}
            onChange={(e) => setStartUtc(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            required
            disabled={loading}
          />

          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            value={endUtc}
            onChange={(e) => setEndUtc(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            required
            disabled={loading}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Checking availability...' : 'Create Booking'}
            </Button>
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
