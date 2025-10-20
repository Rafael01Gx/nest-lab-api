#!/bin/sh

echo "⏳ Aguardando o banco de dados iniciar..."

until nc -z -v -w30 db 3306
do
  echo "⚠️  Aguardando MySQL..."
  sleep 3
done

echo "✅ Banco de dados disponível, aplicando migrações...db push"
npx prisma migrate deploy
#echo "✅ Banco de dados disponível, aplicando migrações...migrate deploy"
#npx prisma db push
npx prisma db seed

echo "🚀 Iniciando aplicação NestJS..."
npm run start:prod
