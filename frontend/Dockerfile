FROM node:22-alpine
WORKDIR /src
EXPOSE ${FRONTEND_UI_PORT}
COPY ../.env ../.env.local ../pnpm* package.json ./
COPY ../common-types/ ./common-types/        
COPY . .
RUN corepack enable
RUN pnpm i
RUN pnpm -F frontend build
CMD pnpm -F frontend serve