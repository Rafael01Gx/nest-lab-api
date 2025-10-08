#!/bin/sh

echo "⏳ Aguardando o banco de dados iniciar..."

# Espera o MySQL responder antes de continuar
until nc -z -v -w30 mysql 3306
do
  echo "⚠️  Aguardando MySQL..."
  sleep 3
done

echo "✅ Banco de dados disponível, aplicando migrações..."

# Aplica as migrações existentes
npx prisma migrate deploy

echo "🚀 Iniciando aplicação NestJS..."
npm run start:prod
