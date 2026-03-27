import jwt from 'jsonwebtoken';


//--Generate Access Token----
//short-lived (15 min), Contains just enough info
export const generateAccessToken=(user)=>{
    return jwt.sign(
        {
            userId:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET,
        {  expiresIn: process.env.JWT_EXPIRES_IN}
    );
};

//--Generate Refresh Token----
//long-lived (7 days), Contains just enough info
//to look up the user nad issue a new access token
export const generateRefreshToken=(user)=>{
    return jwt.sign(
        {userId:user.id},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
};


//--Verify Access Token----
//Returns the decoded token if valid, otherwise throws an error
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//--Verify Refresh Token----
//Returns the decoded token if valid, otherwise throws an error
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};


// ── Set Refresh Token Cookie ───────────────────────────────────
// Puts the refresh token in an HttpOnly cookie.
// HttpOnly = JavaScript cannot read this cookie.
// Secure = only sent over HTTPS (enforced in production).
// SameSite = protects against CSRF attacks.
export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// ── Clear Refresh Token Cookie ─────────────────────────────────
// On logout, we overwrite the cookie with an expired one.
export const clearRefreshTokenCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   0, // expires immediately
  });
};