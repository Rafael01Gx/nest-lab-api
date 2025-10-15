FROM node:22-alpine AS builder

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install --quiet --no-optional --no-fund --log-level=error

COPY . .

RUN npx prisma generate


RUN npm run build

FROM node:22-alpine AS production

WORKDIR /usr/src/api

COPY --from=builder /usr/src/api/dist ./dist
COPY --from=builder /usr/src/api/package*.json ./
COPY --from=builder /usr/src/api/node_modules ./node_modules
COPY --from=builder /usr/src/api/prisma ./prisma
#COPY --from=builder /usr/src/api/.env.production ./.env
COPY --from=builder /usr/src/api/start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["sh", "./start.sh"]
#CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]
#CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && node dist/main.js"]
