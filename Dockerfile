FROM node:16.15.1-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

# Ensure files are owned by root before switching user
USER root
RUN chown -R node:node /usr/src/app

USER node

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]
