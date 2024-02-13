FROM node:lts-alpine3.17 as dev

# cria a pasta, esta pasta é para dizer ao docker que ela é uma pasta compartilhada(para o desenvolvimento funcionar)
#para toda alteração no arquivo ela seja detectada no caintainer
VOLUME ["/app"]

#copia o projeto para o container
COPY ../ /app

WORKDIR /app

ENTRYPOINT .setup/dev/start.sh

EXPOSE ${API_PORT}


FROM node:lts-alpine3.17 as builder

WORKDIR /home/node

RUN npm install -g npm

COPY --chown=node:node ../ .

RUN rm -rf package-lock.json

RUN npm i

RUN npm run build \
    && npm prune --production

FROM node:lts-alpine3.17 as prod
ENV NODE_ENV=production
USER node
WORKDIR /home/node
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/.setup/prod/start.sh ./
#COPY --from=builder --chown=node:node /home/node/.setup/prod/init-letsencrypt.sh ./
COPY --from=builder --chown=node:node /home/node/typeorm-migrations/ ./typeorm-migrations/

ENTRYPOINT "./start.sh"

EXPOSE ${API_PORT}