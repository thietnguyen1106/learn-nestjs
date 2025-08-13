# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build NestJS app
RUN yarn build

# Set environment to production
# ENV NODE_ENV=prod

# Expose application port
# EXPOSE 3333

# Start application
CMD ["node", "dist/main"]
