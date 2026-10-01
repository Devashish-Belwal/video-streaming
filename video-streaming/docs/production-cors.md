# Production CORS Configuration
# Source: backend/src/app.ts (FRONTEND_ORIGIN environment variable)

Requirements:
- Must be runtime-configurable via FRONTEND_ORIGIN
- Must NOT use "*" for production
- Must NOT fall back to localhost:5173 in production

Current code behavior:
  origin: process.env.FRONTEND_ORIGIN || (NODE_ENV === 'production' ? false : 'http://localhost:5173')

Production setting:
  FRONTEND_ORIGIN=https://your-domain.example

If FRONTEND_ORIGIN is empty and NODE_ENV=production, CORS is disabled (false).
Make sure FRONTEND_ORIGIN is always set for production deployments.
