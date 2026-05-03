import { ZodError } from 'zod';

// Wrap a Zod parse to return either { data } or { error: { ...res.json } }
export function validate(schema, payload) {
  try {
    const data = schema.parse(payload);
    return { data, error: null };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        data: null,
        error: {
          status: 400,
          body: { error: 'invalid_input', issues: e.errors.map(i => ({ path: i.path.join('.'), message: i.message })) },
        },
      };
    }
    throw e;
  }
}

// Express helper: send Zod errors as 400 JSON
export function sendValidationError(res, error) {
  return res.status(error.status).json(error.body);
}
