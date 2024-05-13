FROM node:22-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

FROM base as build
WORKDIR /src
COPY ../ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -F common -F backend build
RUN pnpm -F backend deploy --prod /prod

FROM base as serve
WORKDIR /src
COPY --from=build /prod .
EXPOSE ${PORT}
CMD pnpm serve