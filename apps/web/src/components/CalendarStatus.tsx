import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, Box, Button } from '@mui/material';
import { apiService } from '@/services/api.service';

declare global {
  interface Window {
    google?: any;
  }
}

export function CalendarStatus() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadStatus();
    loadGoogleScript();
  }, []);

  const loadGoogleScript = () => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  const loadStatus = async () => {
    try {
      const status = await apiService.getCalendarStatus();
      setConnected(status.connected);
    } catch (err) {
      setConnected(false);
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

    // OAuth 2.0 flow
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

  if (loading) return null;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body1">Google Calendar:</Typography>
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
              <Typography variant="caption" color="textSecondary">
                Bookings will only check internal conflicts
              </Typography>
            </>
          )}
          {connected && (
            <Typography variant="caption" color="textSecondary">
              Checking both internal and Google Calendar conflicts
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
