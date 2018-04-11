FROM golang:latest

ARG app_env
ENV APP_ENV $app_env

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

RUN mkdir -p /go/src/github.com/sharing-wall/api
WORKDIR /go/src/github.com/chrfrasco/sharing-wall/api

COPY Gopkg.toml Gopkg.lock ./
RUN dep ensure -vendor-only

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -a -installsuffix cgo -o api


CMD if [ ${APP_ENV} = production ]; then \
	  api; \
	else \
	  go get github.com/pilu/fresh && \
	  fresh; \
	fi
	
EXPOSE 8080