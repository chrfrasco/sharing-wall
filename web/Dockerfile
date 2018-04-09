FROM node:latest AS builder

ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install -g yarn

COPY yarn.lock yarn.lock
COPY package.json package.json
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/
COPY --from=builder /build /usr/share/nginx/html/
