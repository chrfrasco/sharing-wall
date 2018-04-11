FROM golang:latest

ARG app_env
ENV APP_ENV $app_env

WORKDIR /go/src/chrfrasco/sharing-wall/api
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

CMD if [ ${APP_ENV} = production ]; then \
	  api; \
	else \
	  go get github.com/pilu/fresh && \
	  fresh; \
	fi
	
EXPOSE 8080