// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/jwt.js';

// ── LOGIN ──────────────────────────────────────────────────────
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input exists
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    // 3. Check user exists AND password matches
    // We check both in one condition intentionally —
    // never tell the attacker which one failed.
    // "User not found" vs "Wrong password" gives too much info.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // 4. Check account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account is deactivated. Contact an administrator.'
      });
    }

    // 5. Generate tokens
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 6. Store refresh token hash in database
    // We store it so we can invalidate it on logout.
    // If we didn't store it, we couldn't log the user out
    // before the 7-day expiry.
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: hashedRefreshToken }
    });

    // 7. Set refresh token in HttpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // 8. Send access token and user info in response body
    res.json({
      accessToken,
      user: {
        id:        user.id,
        email:     user.email,
        firstName: user.firstName,
        lastName:  user.lastName,
        role:      user.role,
        avatar:    user.avatar,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── REFRESH TOKEN ──────────────────────────────────────────────
// POST /api/auth/refresh
// Called silently by the frontend when the access token expires.
export const refresh = async (req, res) => {
  try {
    // 1. Read refresh token from HttpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'No refresh token. Please log in again.'
      });
    }

    // 2. Verify the refresh token is valid and not expired
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({
        error: 'Invalid or expired refresh token. Please log in again.'
      });
    }

    // 3. Find the user and check stored refresh token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        error: 'Session invalid. Please log in again.'
      });
    }

    // 4. Compare incoming token against stored hash
    // This ensures the token hasn't been reused after logout
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      return res.status(401).json({
        error: 'Refresh token mismatch. Please log in again.'
      });
    }

    // 5. Issue new tokens (token rotation)
    // Every refresh generates a NEW refresh token.
    // The old one is invalidated. This limits the damage
    // if a refresh token is somehow stolen.
    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // 6. Update stored refresh token
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: hashedNewRefreshToken }
    });

    // 7. Set new refresh token cookie and return new access token
    setRefreshTokenCookie(res, newRefreshToken);
    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── LOGOUT ─────────────────────────────────────────────────────
// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Decode without verifying to get userId
      // (token might be expired but we still want to logout)
      try {
        const decoded = verifyRefreshToken(refreshToken);
        // Clear refresh token from database
        await prisma.user.update({
          where: { id: decoded.userId },
          data:  { refreshToken: null }
        });
      } catch {
        // Token already invalid — that's fine, continue logout
      }
    }

    // Clear the cookie regardless
    clearRefreshTokenCookie(res);
    res.json({ message: 'Logged out successfully.' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── GET CURRENT USER ───────────────────────────────────────────
// GET /api/auth/me
// Protected route — returns the currently logged-in user's info.
// Useful for the frontend to restore user state on page refresh.
export const getMe = async (req, res) => {
  try {
    // req.user was attached by the protect middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id:        true,
        email:     true,
        firstName: true,
        lastName:  true,
        role:      true,
        avatar:    true,
        isActive:  true,
        createdAt: true,
      }
      // select means we explicitly choose fields.
      // password and refreshToken are NEVER returned.
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });

  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};