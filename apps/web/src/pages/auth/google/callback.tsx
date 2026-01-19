import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

export default function GoogleCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const { code } = router.query;

      if (!code) {
        setError('No authorization code received');
        return;
      }

      try {
        // Exchange code for tokens
        const tokenResponse = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: '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', // In production, do this on backend
            redirect_uri: `${window.location.origin}/auth/google/callback`,
            grant_type: 'authorization_code',
          }
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Calculate expiry time
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + expires_in);

        // Send tokens to backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const token = localStorage.getItem('accessToken');

        await axios.post(
          `${apiUrl}/calendar/connect`,
          {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiry: expiry.toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Redirect back to home
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (err: any) {
        console.error('OAuth error:', err);
        setError(err.response?.data?.message || 'Failed to connect calendar');
        
        // Redirect back after error
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      {!error ? (
        <>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Connecting Google Calendar...</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Please wait while we set up your calendar connection
          </Typography>
        </>
      ) : (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2">
            Redirecting back to home...
          </Typography>
        </>
      )}
    </Container>
  );
}
