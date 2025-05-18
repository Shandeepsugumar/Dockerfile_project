FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "online-learning-platform/index.js"]
