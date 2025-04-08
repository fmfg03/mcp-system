const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const serveStatic = require('serve-static');

// Create Express app
const app = express();

// Set port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for simplicity in this demo
}));

// Use compression for all responses
app.use(compression());

// Serve static files with caching
app.use(serveStatic(__dirname, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    // Set longer cache for assets that rarely change
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
  }
}));

// Serve documentation files
app.use('/docs', express.static(path.join(__dirname, '../docs')));

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`MCP System landing page server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the site`);
});
