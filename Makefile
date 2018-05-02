.PHONY: run deploy-img deploy-api init-api-db

run:
	docker-compose up --build

deploy-img:
	git subtree push --prefix img/ heroku-sharing-wall-img master

deploy-api:
	git subtree push --prefix api/ heroku-sharing-wall-api master

init-api-db:
	cat db/init.sql | heroku pg:psql --app sharing-wall-api