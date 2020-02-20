FROM node:10

WORKDIR /ui

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]