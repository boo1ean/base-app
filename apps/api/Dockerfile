FROM node:22-alpine
RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

COPY . .
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["pnpm", "dev"]
