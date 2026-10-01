# Architecture Decision: Option B (Simplest for single-EC2 Docker Compose)
#
# Internet
#    |
#    v
# EC2 (Docker Compose)
#    +--> frontend container (nginx, port 80 exposed to host as 80 or via proxy)
#           - serves static React app
#           - proxies /api/* to backend container via nginx reverse-proxy config
#    +--> backend container (Express, port 3000, NOT exposed to public internet)
#           - connects to external Neon PostgreSQL
#           - connects to private AWS S3
#
# No separate external Nginx required.
# No backend port 3000 exposed to the public.
# Frontend receives only VITE_API_URL=/api at build time (relative path).