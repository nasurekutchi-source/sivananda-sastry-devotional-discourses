FROM node:22-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# Clear stale .next cache on startup, then run dev
CMD ["sh", "-c", "rm -rf .next && npm run dev"]
