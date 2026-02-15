FROM node:22-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install && npm install -g serve

COPY . .

# Build static export
RUN npm run build

EXPOSE 3000

# Serve the static export
CMD ["serve", "out", "-l", "tcp://0.0.0.0:3000", "-s"]
