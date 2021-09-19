FROM node:16
WORKDIR /server
COPY ./server/package*.json ./
RUN yarn cache clean
RUN yarn install
COPY ./server .
EXPOSE 3003
CMD ["node", "server.js"]
