const express = require('express');
const router = express.Router();
// Use mock controller (no FFmpeg required)
const streamController = require('./streamController-mock');

// Start stream endpoint
router.post('/start-stream', (req, res) => {
  const result = streamController.startStream();
  res.json(result);
});

// Stop stream endpoint
router.post('/stop-stream', (req, res) => {
  const result = streamController.stopStream();
  res.json(result);
});

// Get stream status
router.get('/stream-status', (req, res) => {
  const status = streamController.getStatus();
  res.json(status);
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
