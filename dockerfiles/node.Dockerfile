FROM node
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python
RUN apt-get install -y locales
ENV LC_ALL ru_RU.UTF-8
ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU.UTF-8
COPY ./package.json /usr/src/app
RUN npm install -g ts-node ts-node-dev typescript node-dev node-gyp nodemon
RUN npm install
USER app
WORKDIR /usr/src/app