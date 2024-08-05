# for syntax details, see https://docs.docker.com/engine/reference/builder/
# trick to get environment variables https://vsupalov.com/docker-build-pass-environment-variables/

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Environment variables
ARG api_ip
ENV NEXT_PUBLIC_TODO_API_URL=http://${api_ip}:5001
RUN npm run build

# Stage 3: Run
FROM node:20-alpine AS runner
WORKDIR /app

# Create user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

ENV NODE_ENV=production

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

ENV PORT=3000
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED=1

# Start the Next.js application
CMD ["npm", "run", "start"]