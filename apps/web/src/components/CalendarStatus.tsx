import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { apiService } from '@/services/api.service';

export function CalendarStatus() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const status = await apiService.getCalendarStatus();
      setConnected(status.connected);
      setError(null);
    } catch (err: any) {
      setConnected(false);
      // Check if it's a token expiration error
      if (err.response?.status === 401 || err.message?.includes('expired')) {
        setError('expired');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setConnecting(true);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      alert('Google Client ID not configured');
      setConnecting(false);
      return;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/calendar.events';
    const responseType = 'code';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&response_type=${responseType}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar? You will only check internal conflicts.')) {
      return;
    }

    try {
      setDisconnecting(true);
      await apiService.disconnectCalendar();
      setConnected(false);
      setError(null);
      // Reload the page to clear any stale state
      window.location.reload();
    } catch (err: any) {
      alert('Failed to disconnect calendar: ' + (err.message || 'Unknown error'));
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) return null;

  // Show warning if token is expired
  if (error === 'expired' && connected) {
    return (
      <Alert 
        severity="warning" 
        icon={<WarningAmberIcon />}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleConnect}
              disabled={connecting}
            >
              Reconnect
            </Button>
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              Disconnect
            </Button>
          </Box>
        }
      >
        <AlertTitle>Google Calendar Token Expired</AlertTitle>
        Your Google Calendar connection has expired. Please reconnect to enable calendar conflict checking, or disconnect to only check internal conflicts.
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body1" fontWeight="medium">
            Google Calendar:
          </Typography>
          <Chip
            label={connected ? 'Connected' : 'Not Connected'}
            color={connected ? 'success' : 'default'}
            size="small"
          />
          
          {!connected && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : 'Connect Calendar'}
              </Button>
              <Typography variant="caption" color="text.secondary">
                Bookings will only check internal conflicts
              </Typography>
            </>
          )}
          
          {connected && !error && (
            <>
              <Typography variant="caption" color="text.secondary">
                Checking both internal and Google Calendar conflicts
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleDisconnect}
                disabled={disconnecting}
                color="error"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
