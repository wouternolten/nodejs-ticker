.PHONY: help
help:
	@echo 'To install the development environment use: make install'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "%s%-30s%s %s\n", "${CYAN}", $$1, "${DEFAULT}",$$2}'

install: ## Install the development environment
	./scripts/install/install-development

start: ## Start the development environment
	docker-compose up -d mysql-main-database frontend-ticker backend-ticker

create_migration: ## Create a migration.
	docker run --net=nodejs-ticker_default --rm --name migrations -v $(PWD):/usr/src/app -w /usr/src/app -e COMMAND=migrate node:12 node ./database/scripts/database.js add migration ${FILENAME}

create_provision: ## Create a provision SQL file. Use TABLE_NAME=<table_name> to change the file name
	docker run --net=nodejs-ticker_default --rm --name migrations -v $(PWD):/usr/src/app -w /usr/src/app -e COMMAND=provision node:12 node ./database/scripts/database.js add migration ${TABLE_NAME}

migrate: ## Migrate the database. Use DATABASE=acceptance to migrate the acceptance database.
ifeq ($(DATABASE), acceptance)
	docker run --net=nodejs-ticker_default --rm --name migrations -v $(PWD):/usr/src/app -w /usr/src/app -e DATABASE=acceptance -e COMMAND=migrate node:12 node ./database/scripts/database.js up
else
	docker run --net=nodejs-ticker_default --rm --name migrations -v $(PWD):/usr/src/app -w /usr/src/app -e COMMAND=migrate node:12 node ./database/scripts/database.js up
endif

provision: ## Provision the database. Use DATABASE=acceptance to provision the acceptance database.
ifeq ($(DATABASE), acceptance)
	docker run --net=nodejs-ticker_default --rm --name provision -v $(PWD):/usr/src/app -w /usr/src/app -e DATABASE=acceptance -e COMMAND=provision node:12 node ./database/scripts/database.js up
else
	docker run --net=nodejs-ticker_default --rm --name provision -v $(PWD):/usr/src/app -w /usr/src/app -e COMMAND=provision node:12 node ./database/scripts/database.js up
endif

setup-acceptance-database: ## Setup the acceptance database
	./scripts/acceptance/setup-database

test: ## Run all test suites.
	make test-unit
	make test-acceptance

test-unit: ## Run all unit tests
	npm test

test-acceptance:
	npm run cy:run-frontend
