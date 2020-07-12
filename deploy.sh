#!/usr/bin/env bash
apt-get update
apt-get install nginx docker git curl mc autoconf automake libtool curl make g++ unzip zip -y
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
apt-get install nodejs protobuf-compiler docker-compose -y
npm i -g typescript ts-node ts-node-dev node-gyp pm2 @nestjs/cli
# nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
cd /usr
mkdir server
cd server
ssh-keygen
echo "You must to add this key to github..."