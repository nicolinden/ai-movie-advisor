FROM node:24-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY frontend ./frontend
COPY backend ./backend

RUN cd frontend && npm run build
RUN mkdir -p backend/public
RUN cp -r frontend/dist/ai-movie-advisor-frontend/browser/* backend/public/

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/public ./public

EXPOSE 3000

CMD ["node", "dist/index.js"]