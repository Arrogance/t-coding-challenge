.PHONY: all build build-no-cache up stop down bash install update migrate seed lint lint-fix test test-watch logs

ENV_FILE := .env
ifeq ($(wildcard .env.local), .env.local)
  ENV_FILE := .env.local
endif

PROJECT_NAME := $(shell grep -m 1 '^APP_NAME=' $(ENV_FILE) | cut -d '=' -f2)

COMPOSE_FILES := -f compose.yaml
ifneq ($(wildcard compose.override.yaml),)
  COMPOSE_FILES += -f compose.override.yaml
endif

DC_CMD     = docker compose $(COMPOSE_FILES) -p $(PROJECT_NAME) --env-file $(ENV_FILE)
DC_RUN_APP = $(DC_CMD) exec app

all: build up install migrate seed

build:
	@$(DC_CMD) build

build-no-cache:
	@$(DC_CMD) build --no-cache

up:
	@$(DC_CMD) up -d

stop:
	@$(DC_CMD) stop

down:
	@$(DC_CMD) down

bash:
	@$(DC_RUN_APP) sh

install:
	@$(DC_RUN_APP) npm install

update:
	@$(DC_RUN_APP) npm update

migrate:
	@$(DC_RUN_APP) npm run migrate

seed:
	@$(DC_RUN_APP) npm run seed

lint:
	@$(DC_RUN_APP) npm run lint

lint-fix:
	@$(DC_RUN_APP) npm run lint:fix

test:
	@$(DC_RUN_APP) npm test

logs:
	@$(DC_CMD) logs -f
