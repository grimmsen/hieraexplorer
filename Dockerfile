FROM node:8
EXPOSE 8080
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install nodemon
RUN mkdir /data
COPY . .
CMD [ "npm","start" ]

