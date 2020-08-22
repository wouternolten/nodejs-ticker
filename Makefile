.PHONY: help
help:
	@echo 'To install the development environment use: make install'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "%s%-30s%s %s\n", "${CYAN}", $$1, "${DEFAULT}",$$2}'

install: ## Install the development environment
	./scripts/install/install-development

start: ## Start the development environment
	docker-compose up -d mysql-main-database frontend-ticker backend-ticker

migrate: ## Migrate the database
	npm run migrate

setup-acceptance-database: ## Setup the acceptance database
	./scripts/acceptance/setup-database

test: ## Run all test suites.
	make test-unit
	make test-acceptance

test-unit: ## Run all unit tests
	npm test

test-acceptance:
	npm run cy:run-frontend
	npm run cy:run-backend
