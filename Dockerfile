FROM node:22-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install --quiet --no-optional --no-fund --log-level=error

COPY . .

COPY ./.env.production ./.env

RUN npx prisma generate

RUN npm run build

RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["sh", "./start.sh"]

# CMD ["npm", "run", "start:prod"]
