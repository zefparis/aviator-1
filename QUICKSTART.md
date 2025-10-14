# ⚡ Quick Start - Aviator Game

Guide ultra-rapide pour lancer le projet en 5 minutes.

## 🚀 Installation Express

```bash
# 1. Cloner
git clone <repo-url>
cd aviator-game

# 2. Installer
pnpm install

# 3. Configurer DB
cd apps/web
cp .env.example .env
# Éditer .env avec vos credentials PostgreSQL

# 4. Init DB
pnpm prisma db push

# 5. Lancer
cd ../..
pnpm dev
```

## 🌐 URLs

- Frontend : http://localhost:3000
- Backend : http://localhost:3001
- Health : http://localhost:3001/health

## 🎮 Tester le Jeu

1. Ouvrir http://localhost:3000
2. Attendre le prochain round
3. Placer un pari (montant par défaut : $10)
4. Cliquer sur "Cashout" avant le crash
5. Voir vos gains !

## 🐳 Avec Docker (Alternative)

```bash
# Créer docker-compose.yml
docker-compose up -d
```

## 🚂 Déployer sur Railway

```bash
# Installer CLI
npm i -g @railway/cli

# Login
railway login

# Init
railway init

# Ajouter PostgreSQL
railway add postgresql

# Déployer
railway up
```

## 📝 Variables d'Environnement Minimales

### apps/web/.env
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/aviator"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

### apps/server/.env
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/aviator"
PORT=3001
```

## 🆘 Problèmes Courants

**Erreur : Cannot find module**
```bash
pnpm install
```

**Erreur : Prisma Client not generated**
```bash
cd apps/web
pnpm prisma generate
```

**Erreur : Port already in use**
```bash
# Changer le port dans .env
PORT=3002
```

## 📚 Prochaines Étapes

- Lire [README.md](./README.md) pour la doc complète
- Lire [DEPLOY.md](./DEPLOY.md) pour Railway
- Personnaliser le jeu dans `apps/web/src/components/game/`

---

**Bon code ! 💻**
