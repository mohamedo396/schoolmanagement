import express      from 'express';
import cors         from 'cors';
import helmet       from 'helmet';
import morgan       from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv       from 'dotenv';

import authRoutes       from './routes/auth.routes.js';
import studentRoutes    from './routes/student.routes.js';
import classRoutes      from './routes/class.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import gradeRoutes      from './routes/grade.routes.js';
import dashboardRoutes  from './routes/dashboard.routes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/students',   studentRoutes);
app.use('/api/classes',    classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades',     gradeRoutes);
app.use('/api/dashboard',  dashboardRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
// This catches any AppError thrown from services
// and sends the right status code automatically
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message    = err.isOperational ? err.message : 'Internal Server Error';
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});