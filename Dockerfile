FROM node:19-alpine

# Create app directory

WORKDIR /usr/src/access_auth_server

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json .
COPY package-lock.json .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3002
EXPOSE 3003

CMD ["node", "server.js"]