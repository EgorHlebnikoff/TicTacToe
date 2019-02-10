FROM node

WORKDIR /usr/src/node_modules

COPY /node_modules .

WORKDIR /usr/src/server

COPY /server .

WORKDIR /usr/src/public

COPY /public .

WORKDIR /usr/src

CMD ["node", "server/server.js"]
