FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0

CMD ["npm", "start"]
