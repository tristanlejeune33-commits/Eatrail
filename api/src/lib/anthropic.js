// Anthropic client singleton — used by all AI features (inference, vision, etc.)
// Default model: claude-opus-4-7 (most capable, recommended).
// Use ANTHROPIC_API_KEY env var (auto-picked up by the SDK).
import Anthropic from '@anthropic-ai/sdk';

const globalForClient = globalThis;

export const anthropic = globalForClient.anthropic ?? new Anthropic();

if (process.env.NODE_ENV !== 'production') {
  globalForClient.anthropic = anthropic;
}

export function isConfigured() {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Default model + parameters used across the codebase.
// Override per-call via the options arg.
export const DEFAULT_MODEL = 'claude-opus-4-7';
