FROM node:18-alpine3.17

# Setting up the work directory
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Starting our application
CMD [ "node", "server.js" ]

# Exposing server port
EXPOSE 3000