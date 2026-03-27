// src/utils/errors.js

// A custom error class that carries an HTTP status code.
// When we throw this anywhere in the app, our global error
// handler in index.js catches it and sends the right status.
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes our errors from unexpected ones
  }
}