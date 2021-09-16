FROM node:8
WORKDIR /server
COPY ./server/package*.json ./
RUN yarn install
COPY ./server .
EXPOSE 3003
CMD ["node", "server.js"]
