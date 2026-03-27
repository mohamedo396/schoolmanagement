// src/middleware/auth.middleware.js
import { verifyAccessToken } from '../utils/jwt.js';

// ── Protect Middleware ─────────────────────────────────────────
// Verifies the access token on every protected request.
// If valid, attaches the decoded user info to req.user
// so route handlers know who is making the request.
export const protect = (req, res, next) => {
  try {
    // The token comes in the Authorization header as:
    // "Bearer eyJhbGciOiJIUzI1NiJ9..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    // Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify the token — throws an error if invalid or expired
    const decoded = verifyAccessToken(token);

    // Attach user info to the request object.
    // Every subsequent middleware and route handler
    // can now access req.user.
    req.user = decoded;

    next(); // pass control to the next middleware/handler

  } catch (error) {
    // jwt.verify throws specific errors we can handle
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired. Please refresh.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token.'
      });
    }
    return res.status(500).json({ error: 'Authentication error.' });
  }
};

// ── Restrict To Middleware ─────────────────────────────────────
// Used AFTER protect. Checks the user's role.
// Usage: router.delete('/', protect, restrictTo('ADMIN'), handler)
//
// Returns a middleware function — this is a "middleware factory"
// pattern. We call restrictTo('ADMIN') which RETURNS the actual
// middleware function. This lets us pass arguments to middleware.
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};