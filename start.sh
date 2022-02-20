#! /bin/sh
echo "iniciando app..."

echo "instalando as dependencias..."
npm install

npm run build

echo "executando as MIGRACOES do banco..."
npx typeorm migration:run

echo "iniciando a api..."
npm run start:prod