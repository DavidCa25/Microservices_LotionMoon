FROM node:20.15.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run start

EXPOSE 3002

CMD ["node", "dist/index.js"]