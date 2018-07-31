FROM node:carbon-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
RUN npm i --production

COPY . /app
RUN npm run build
CMD ["npm", "start"]
