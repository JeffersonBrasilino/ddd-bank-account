#! /bin/sh
echo "iniciando app em DESENVOLVIMENTO..."

echo "instalando dependencias..."

npm install -g npm

npm install

echo "executando migrations..."

npm run migration:run

npm run start:dev