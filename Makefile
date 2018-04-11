.PHONY: run deploy

run:
	docker-compose up --build

deploy:
	APP_ENV=production docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build