FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json frontend/
COPY packages/contracts/package*.json packages/contracts/
RUN npm install

COPY . .
RUN npm run build:contracts && npm run build:frontend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/frontend/package*.json ./frontend/
COPY --from=base /app/frontend/node_modules ./frontend/node_modules
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/frontend/public ./frontend/public

EXPOSE 3000
CMD ["npm", "run", "-w", "frontend", "start"]
