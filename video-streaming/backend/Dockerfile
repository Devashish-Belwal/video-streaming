# Production backend image
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/dist /app/dist
COPY --from=build /app/generated /app/generated
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/src/config /app/src/config
RUN npm install
EXPOSE 3000
CMD ["node", "dist/src/server.js"]
