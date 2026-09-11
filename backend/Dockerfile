# ─── Development ───────────────────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 3001
CMD ["sh", "-c", "npx prisma generate && npx tsx watch src/index.ts"]

# ─── Production build ──────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate && npx tsc --noEmit

# ─── Production ────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup --system app && adduser --system --ingroup app app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
RUN npx prisma generate
USER app
EXPOSE 3001
CMD ["node", "dist/index.js"]
