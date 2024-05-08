FROM node:22-alpine
WORKDIR /src
EXPOSE ${BACKEND_FASTIFY_PORT}
COPY ../.env ../.env.local ../pnpm* package.json  ./
COPY ../common-types/ ./common-types/
COPY . .
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN apk add --no-cache chromium
RUN corepack enable
RUN pnpm i
RUN pnpm -F backend build
CMD pnpm -F backend serve