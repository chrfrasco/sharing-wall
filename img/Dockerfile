FROM kinlan/puppets:latest

RUN npm install -g yarn

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY ./ ./

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules

USER pptruser

ENTRYPOINT ["dumb-init", "--"]
CMD if [ ${APP_ENV} = production ]; then \
	  yarn server; \
	else \
 		yarn start; \
	fi
