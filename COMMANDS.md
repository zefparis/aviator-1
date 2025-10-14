# ⚡ Commandes Essentielles - Aviator Game

Toutes les commandes dont tu as besoin, au même endroit.

---

## 🚀 Installation

```bash
# Installation automatique (recommandé)
chmod +x INSTALL.sh
./INSTALL.sh

# OU installation manuelle
pnpm install
```

---

## 🎮 Développement

### Lancer Tout (Recommandé)
```bash
pnpm dev
```
Démarre frontend + backend en parallèle avec Turbo.

### Lancer Séparément
```bash
# Terminal 1 - Backend
cd apps/server
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### URLs de Développement
- Frontend : http://localhost:3000
- Backend : http://localhost:3001
- Health : http://localhost:3001/health
- Prisma Studio : http://localhost:5555

---

## 🗄️ Base de Données

### PostgreSQL avec Docker
```bash
# Démarrer
docker-compose -f docker-compose.dev.yml up -d

# Arrêter
docker-compose -f docker-compose.dev.yml down

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f

# Redémarrer
docker-compose -f docker-compose.dev.yml restart
```

### Prisma
```bash
# Générer le client
cd apps/web
pnpm prisma generate

# Sync le schéma avec la DB
pnpm prisma db push

# Ouvrir Prisma Studio (GUI)
pnpm prisma studio

# Créer une migration
pnpm prisma migrate dev --name nom_migration

# Reset la DB (⚠️ supprime toutes les données)
pnpm prisma migrate reset
```

---

## 🏗️ Build & Production

### Build
```bash
# Build tout
pnpm build

# Build frontend uniquement
cd apps/web
pnpm build

# Build backend uniquement
cd apps/server
pnpm build
```

### Lancer en Production
```bash
# Lancer tout
pnpm start

# OU séparément
cd apps/server && pnpm start  # Backend
cd apps/web && pnpm start     # Frontend
```

---

## 🧹 Nettoyage

```bash
# Nettoyer les builds
pnpm clean

# Supprimer node_modules
rm -rf node_modules apps/*/node_modules

# Tout nettoyer et réinstaller
pnpm clean
rm -rf node_modules apps/*/node_modules
pnpm install
```

---

## 🚂 Railway

### Via CLI
```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Lier au projet
railway link

# Voir les variables
railway variables

# Définir une variable
railway variables set KEY=value

# Déployer
railway up

# Voir les logs
railway logs

# Ouvrir le dashboard
railway open
```

### Via Dashboard
1. https://railway.app
2. Sélectionner le projet
3. Configurer les variables
4. Deploy

---

## 🔍 Debugging

### Logs Backend
```bash
cd apps/server
pnpm dev

# Les logs s'affichent en temps réel
```

### Logs Frontend
```bash
cd apps/web
pnpm dev

# Ouvrir la console du navigateur (F12)
```

### Tester l'API
```bash
# Health check
curl http://localhost:3001/health

# Stats
curl http://localhost:3001/api/stats
```

### Tester WebSocket
```javascript
// Dans la console du navigateur
const socket = io('http://localhost:3001');
socket.on('connect', () => console.log('Connected!'));
socket.on('round:start', (data) => console.log('Round started:', data));
```

---

## 📝 Git

```bash
# Status
git status

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: description"

# Push
git push origin main

# Créer une branche
git checkout -b feature/ma-feature

# Voir les branches
git branch

# Changer de branche
git checkout main
```

---

## 🧪 Tests (à implémenter)

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 🛠️ Makefile

```bash
# Voir toutes les commandes
make help

# Installer
make install

# Développement
make dev

# Build
make build

# Lancer en prod
make start

# Nettoyer
make clean

# PostgreSQL Docker
make docker-up
make docker-down
make docker-logs

# Base de données
make db-push
make db-studio

# Setup complet
make setup

# Lint
make lint

# Format
make format
```

---

## 📦 Gestion des Dépendances

### Ajouter une Dépendance
```bash
# Frontend
pnpm add package-name --filter @aviator/web

# Backend
pnpm add package-name --filter @aviator/server

# Les deux
pnpm add package-name --filter @aviator/web --filter @aviator/server

# Dev dependency
pnpm add -D package-name --filter @aviator/web
```

### Supprimer une Dépendance
```bash
pnpm remove package-name --filter @aviator/web
```

### Mettre à Jour
```bash
# Voir les mises à jour disponibles
pnpm outdated

# Mettre à jour tout
pnpm update

# Mettre à jour un package spécifique
pnpm update package-name
```

---

## 🔧 Utilitaires

### Formater le Code
```bash
# Formater tout
pnpm prettier --write .

# Formater un fichier
pnpm prettier --write apps/web/src/app/page.tsx
```

### Linter
```bash
# Lint tout
pnpm lint

# Lint et fix
pnpm lint --fix
```

### TypeScript Check
```bash
# Vérifier les types
cd apps/web
pnpm tsc --noEmit

cd apps/server
pnpm tsc --noEmit
```

---

## 📊 Monitoring

### Voir les Processus
```bash
# Processus Node.js
ps aux | grep node

# Ports utilisés
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL
```

### Tuer un Processus
```bash
# Par port
kill -9 $(lsof -t -i:3000)

# Par nom
pkill -f "node"
```

---

## 🎯 Commandes Rapides

### Démarrage Rapide
```bash
./INSTALL.sh && pnpm dev
```

### Reset Complet
```bash
pnpm clean
rm -rf node_modules apps/*/node_modules
docker-compose -f docker-compose.dev.yml down -v
pnpm install
make docker-up
cd apps/web && pnpm prisma db push
cd ../.. && pnpm dev
```

### Build et Test
```bash
pnpm build && pnpm start
```

### Déploiement Railway
```bash
railway login
railway init
railway add postgresql
railway variables set JWT_SECRET="secret"
railway up
```

---

## 🆘 Dépannage

### "Port already in use"
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### "Cannot find module"
```bash
pnpm install
```

### "Prisma Client not generated"
```bash
cd apps/web
pnpm prisma generate
```

### "Database connection failed"
```bash
# Vérifier que PostgreSQL tourne
docker ps

# Redémarrer PostgreSQL
make docker-down
make docker-up
```

### "WebSocket not connecting"
```bash
# Vérifier que le backend tourne
curl http://localhost:3001/health

# Vérifier NEXT_PUBLIC_WS_URL dans .env
cat apps/web/.env | grep WS_URL
```

---

## 📚 Aide

```bash
# Voir l'aide du Makefile
make help

# Voir l'aide de pnpm
pnpm --help

# Voir l'aide de Prisma
pnpm prisma --help

# Voir l'aide de Railway
railway --help
```

---

## 🎯 Workflow Typique

### Développement d'une Feature
```bash
# 1. Créer une branche
git checkout -b feature/ma-feature

# 2. Lancer en dev
pnpm dev

# 3. Coder...

# 4. Tester
# Ouvrir http://localhost:3000

# 5. Commit
git add .
git commit -m "feat: ma feature"

# 6. Push
git push origin feature/ma-feature

# 7. Créer une PR sur GitHub
```

### Déploiement
```bash
# 1. Merge sur main
git checkout main
git pull

# 2. Build local
pnpm build

# 3. Tester en prod local
pnpm start

# 4. Push
git push origin main

# 5. Railway déploie automatiquement
# Ou manuellement : railway up
```

---

**Garde ce fichier sous la main ! 📌**
