// This is a reusable middleware that takes a Zod schema and validates req.body against it
import { ZodError } from 'zod';

// A middleware factory — takes a Zod schema, returns a middleware.
// Usage: router.post('/', validate(createStudentSchema), handler)
export const validate = (schema) => (req, res, next) => {
  try {
    // safeParse returns { success, data, error } instead of throwing
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Format Zod errors into a readable structure
      const errors = result.error.errors.map(err => ({
        field:   err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        error:  'Validation failed',
        errors, // e.g. [{ field: 'email', message: 'Invalid email' }]
      });
    }

    // Replace req.body with the validated & typed data
    req.body = result.data;
    next();

  } catch (error) {
    next(error);
  }
};