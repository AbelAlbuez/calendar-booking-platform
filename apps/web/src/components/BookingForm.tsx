import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import { CreateBookingDto } from '@calendar-booking/shared';

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateBookingDto) => Promise<void>;
  loading: boolean;
}

export function BookingForm({ open, onClose, onSubmit, loading }: BookingFormProps) {
  const [title, setTitle] = useState('');
  const [startUtc, setStartUtc] = useState('');
  const [endUtc, setEndUtc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setStartUtc('');
      setEndUtc('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!title.trim()) {
      setError('Please enter a title for your booking');
      return;
    }

    if (!startUtc || !endUtc) {
      setError('Please select both start and end times');
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

    // Check if booking is too short (less than 15 minutes)
    const duration = (end.getTime() - start.getTime()) / 1000 / 60;
    if (duration < 15) {
      setError('Booking must be at least 15 minutes long');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
      });
      
      setSuccess(true);
      
      // Close after showing success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Get minimum datetime (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <EventIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          Create New Booking
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success">
                Booking created successfully!
              </Alert>
            )}

            <TextField
              label="Meeting Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading || success}
              placeholder="e.g., Team Standup, Client Meeting"
              autoFocus
              helperText="What is this booking for?"
            />

            <Box>
              <TextField
                label="Start Date & Time"
                type="datetime-local"
                fullWidth
                value={startUtc}
                onChange={(e) => setStartUtc(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                disabled={loading || success}
                inputProps={{
                  min: getMinDateTime(),
                }}
                helperText="When does the meeting start?"
              />
            </Box>

            <Box>
              <TextField
                label="End Date & Time"
                type="datetime-local"
                fullWidth
                value={endUtc}
                onChange={(e) => setEndUtc(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                disabled={loading || success}
                inputProps={{
                  min: startUtc || getMinDateTime(),
                }}
                helperText="When does the meeting end?"
              />
            </Box>

            {startUtc && endUtc && (
              <Alert severity="info" icon={<EventIcon />}>
                Duration: {Math.round((new Date(endUtc).getTime() - new Date(startUtc).getTime()) / 1000 / 60)} minutes
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading || success}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{ minWidth: 140 }}
          >
            {loading ? 'Creating...' : success ? 'Created!' : 'Create Booking'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
