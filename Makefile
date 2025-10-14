# Makefile pour Aviator Game
# Commandes utiles pour le développement

.PHONY: help install dev build start clean db-push db-studio docker-up docker-down

help: ## Affiche l'aide
	@echo "Aviator Game - Commandes disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances
	pnpm install

dev: ## Lance en mode développement
	pnpm dev

build: ## Build pour production
	pnpm build

start: ## Lance en production
	pnpm start

clean: ## Nettoie les fichiers générés
	pnpm clean
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf .turbo

db-push: ## Sync le schema Prisma avec la DB
	cd apps/web && pnpm prisma db push

db-studio: ## Ouvre Prisma Studio
	cd apps/web && pnpm prisma studio

docker-up: ## Lance PostgreSQL et Redis avec Docker
	docker-compose -f docker-compose.dev.yml up -d

docker-down: ## Arrête les containers Docker
	docker-compose -f docker-compose.dev.yml down

docker-logs: ## Affiche les logs Docker
	docker-compose -f docker-compose.dev.yml logs -f

setup: ## Lance le script de setup
	chmod +x setup.sh
	./setup.sh

lint: ## Lint le code
	pnpm lint

format: ## Formate le code avec Prettier
	pnpm prettier --write .

test: ## Lance les tests
	pnpm test
