import https from 'https';

/**
 * Render free tier spins down web services after 15 minutes of inactivity.
 * This cron job pings the server's own external URL every 14 minutes to keep it awake.
 */
export const startKeepAliveCron = () => {
  // Render automatically provides RENDER_EXTERNAL_URL in production
  const backendUrl = process.env.RENDER_EXTERNAL_URL;
  
  if (!backendUrl) {
    console.log('Keep-alive cron: No RENDER_EXTERNAL_URL found. Skipping cron (likely running locally).');
    return;
  }

  console.log(`Starting keep-alive cron job for ${backendUrl}`);

  // 14 minutes in milliseconds
  const INTERVAL = 14 * 60 * 1000;

  setInterval(() => {
    https.get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('Keep-alive ping successful');
      } else {
        console.log(`Keep-alive ping received status code: ${res.statusCode}`);
      }
    }).on('error', (err) => {
      console.error('Keep-alive ping failed:', err.message);
    });
  }, INTERVAL);
};
