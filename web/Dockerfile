FROM node:latest

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV NODE_ENV $app_env

RUN mkdir -p /web
WORKDIR /web
COPY ./ ./

RUN npm install

RUN apt-get install bash
CMD if [ ${NODE_ENV} = production ]; then \
    npm install -g http-server && \
    npm run build && \
    cd build && \
    hs -p 3000 --proxy "http://api:8080"; \
	else \
	  npm run start; \
	fi

EXPOSE 3000
