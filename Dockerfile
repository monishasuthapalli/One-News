# syntax=docker/dockerfile:1
FROM node:12.16.3

ENV NODE_ENV=production
 
WORKDIR ./

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "npm", "start" ]