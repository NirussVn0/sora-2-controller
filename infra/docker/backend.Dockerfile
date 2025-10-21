FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
COPY packages/contracts/package*.json packages/contracts/
RUN npm install

# Build shared contracts and backend
COPY . .
RUN npm run build:contracts && npm run build:backend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/backend/package*.json ./backend/
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/backend/node_modules ./backend/node_modules

EXPOSE 4000
CMD ["npm", "run", "-w", "backend", "start:prod"]
