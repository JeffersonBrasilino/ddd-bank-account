#! /bin/sh
echo "iniciando app em DESENVOLVIMENTO..."

npm install -g npm

npm install

npm run migration:run

npm run start:dev