FROM node:22-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as build
WORKDIR /src
COPY ../ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -F common -F frontend build
RUN pnpm -F frontend deploy --prod /prod

FROM nginx:1.26.0-alpine-slim
COPY --from=build /prod/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /prod/dist/ /var/www/html/
