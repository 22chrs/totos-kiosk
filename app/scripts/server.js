const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const retryInterval = 5000; // Retry every 5 seconds

function startServer() {
  const server = express();

  server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8082'); // If accessing locally
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  });

  // Serve static files from the 'public' directory with cache-control headers
  server.use(
    '/public',
    express.static(path.join(__dirname, 'public'), {
      maxAge: '30d', // Cache for 30 days
      immutable: true, // Files will not change
    }),
  );

  // Logging middleware to log each request
  server.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next(); // pass control to the next handler
  });

  // Handle all other requests with Next.js
  server.get('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 3000; // Use PORT environment variable or 3000 by default
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on server port ${port}`);
  });
}

function prepareAppWithRetry() {
  app
    .prepare()
    .then(startServer)
    .catch((error) => {
      console.error('Error preparing Next.js application:', error);
      console.log(`Retrying in ${retryInterval / 1000} seconds...`);
      setTimeout(prepareAppWithRetry, retryInterval);
    });
}

prepareAppWithRetry();
