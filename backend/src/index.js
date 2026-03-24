import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables FIRST — before anything else
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────
// Middleware are functions that run on EVERY request before it
// reaches your route handlers. Think of them as a pipeline.

app.use(helmet());          // Security headers
app.use(morgan('dev'));     // Request logging
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true         // Allow cookies to be sent
}));
app.use(express.json());    // Parse incoming JSON request bodies

// ─── Health Check Route ────────────────────────────────────────
// A simple endpoint to confirm the server is running.
// Load balancers and deployment platforms use this.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ─── 404 Handler ──────────────────────────────────────────────
// If no route matched above, send a 404.
// The order matters — this must come AFTER all routes.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────
// Any error passed to next(err) anywhere in the app lands here.
// Express identifies this as an error handler because it has 4 params.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});