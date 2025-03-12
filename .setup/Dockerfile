FROM node:lts-alpine3.21 AS dev

VOLUME ["/app"]

COPY ../ /app

WORKDIR /app

ENTRYPOINT .setup/dev/start.sh

EXPOSE ${API_PORT}


FROM node:lts-alpine3.21 AS builder

WORKDIR /home/node

RUN npm install -g npm

COPY --chown=node:node ../ .

RUN rm -rf package-lock.json

RUN npm i

RUN npm run build \
    && npm prune --production

FROM node:lts-alpine3.21 AS prod
ENV NODE_ENV=production
USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.setup/prod/start.sh ./
COPY --from=builder --chown=node:node /home/node/typeorm-migrations/ ./typeorm-migrations/

ENTRYPOINT "./start.sh"

EXPOSE ${API_PORT}