FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 4000 5173

CMD ["sh", "-c", "npx prisma db push && (npm run dev:backend & npm run dev:frontend:docker)"]
