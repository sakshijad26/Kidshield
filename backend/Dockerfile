FROM node:22-alpine as dev
WORKDIR /app
COPY package*.json ./   
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npx" , "nodemon", "server.js" ]



FROM node:22-alpine as prod
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "node", "server.js" ]