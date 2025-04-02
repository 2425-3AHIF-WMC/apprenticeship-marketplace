FROM node:16

WORKDIR /index

COPY package*.json ./
RUN npm install

COPY ../.. .

EXPOSE 5000

CMD ["node", "src/index.js"]