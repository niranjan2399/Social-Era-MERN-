ifneq (,$(wildcard ./.env))
	include ./.env
	export
	ENV_FILE_PARAM = --env-file .ENV_FILE_PARAM
endif

build:
	docker-compose up --build

config:
	docker-compose config

up:
	docker-compose up

down:
	docker-compose down

volume:
	docker volume inspect mongodb-data