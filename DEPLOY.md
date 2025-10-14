# 🚀 Guide de Déploiement Railway - Aviator Game

Ce guide détaille le déploiement complet de l'application Aviator sur Railway.

## 📋 Prérequis

- Compte Railway ([railway.app](https://railway.app))
- Compte GitHub (pour le déploiement automatique)
- Code pushé sur GitHub

## 🎯 Architecture de Déploiement

Railway va créer **2 services** :
1. **Backend (Server)** - Port 3001 - Socket.io + Express
2. **Frontend (Web)** - Port 3000 - Next.js 14
3. **PostgreSQL** - Base de données managée

## 📝 Étape par Étape

### 1. Créer un Nouveau Projet

1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur **"New Project"**
3. Sélectionner **"Deploy from GitHub repo"**
4. Autoriser Railway à accéder à votre repo
5. Sélectionner le repo `aviator-game`

### 2. Ajouter PostgreSQL

1. Dans votre projet Railway, cliquer sur **"+ New"**
2. Sélectionner **"Database"** → **"PostgreSQL"**
3. Railway va créer une instance PostgreSQL
4. La variable `DATABASE_URL` sera auto-générée

### 3. Configurer le Backend (Server)

1. Cliquer sur le service **server**
2. Aller dans **"Variables"**
3. Ajouter les variables suivantes :

```env
# Auto-généré par Railway
DATABASE_URL=${{Postgres.DATABASE_URL}}

# À configurer manuellement
JWT_SECRET=votre-secret-jwt-super-securise-changez-moi
PORT=3001
NODE_ENV=production

# Game settings
GAME_ROUND_DURATION=30000
GAME_UPDATE_INTERVAL=100
MIN_BET=1
MAX_BET=10000
```

4. Dans **"Settings"** :
   - **Root Directory** : `apps/server`
   - **Build Command** : `pnpm install && pnpm build`
   - **Start Command** : `pnpm start`
   - **Watch Paths** : `apps/server/**`

5. Cliquer sur **"Deploy"**

### 4. Configurer le Frontend (Web)

1. Cliquer sur **"+ New"** → **"Service"** → **"GitHub Repo"**
2. Sélectionner le même repo
3. Aller dans **"Variables"**
4. Ajouter les variables suivantes :

```env
# Database (partagée avec le backend)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT (même secret que le backend)
JWT_SECRET=${{server.JWT_SECRET}}

# URL du serveur WebSocket (IMPORTANT!)
NEXT_PUBLIC_WS_URL=https://votre-server.up.railway.app

# App URL
NEXT_PUBLIC_APP_URL=https://votre-web.up.railway.app
```

5. Dans **"Settings"** :
   - **Root Directory** : `apps/web`
   - **Build Command** : `pnpm install && pnpm prisma generate && pnpm build`
   - **Start Command** : `pnpm start`
   - **Watch Paths** : `apps/web/**`

6. Cliquer sur **"Deploy"**

### 5. Obtenir les URLs

Une fois déployé, Railway génère des URLs :
- Backend : `https://aviator-server-production.up.railway.app`
- Frontend : `https://aviator-web-production.up.railway.app`

### 6. Mettre à Jour NEXT_PUBLIC_WS_URL

⚠️ **IMPORTANT** : Après le premier déploiement du backend :

1. Copier l'URL du backend
2. Aller dans les variables du **frontend**
3. Mettre à jour `NEXT_PUBLIC_WS_URL` avec l'URL du backend
4. Redéployer le frontend

### 7. Initialiser la Base de Données

Option 1 - Via Railway CLI :
```bash
railway login
railway link
railway run pnpm --filter @aviator/web prisma db push
```

Option 2 - Via le backend :
Le backend va automatiquement créer les tables au premier lancement grâce à Prisma.

## 🔍 Vérification

### 1. Backend Health Check

```bash
curl https://votre-server.up.railway.app/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "activeConnections": 0
}
```

### 2. Frontend

Ouvrir `https://votre-web.up.railway.app` dans le navigateur.

### 3. WebSocket

Ouvrir la console du navigateur et vérifier :
```
✅ Connected to game server
```

## 🐛 Troubleshooting

### Problème 1 : "Cannot connect to WebSocket"

**Cause** : `NEXT_PUBLIC_WS_URL` incorrecte ou backend non démarré

**Solution** :
1. Vérifier que le backend est déployé et running
2. Vérifier que `NEXT_PUBLIC_WS_URL` pointe vers l'URL du backend
3. Redéployer le frontend après modification

### Problème 2 : "Prisma Client not generated"

**Cause** : Prisma n'a pas été généré pendant le build

**Solution** :
1. Aller dans Settings → Build Command
2. S'assurer que la commande contient `pnpm prisma generate`
3. Redéployer

### Problème 3 : "Database connection failed"

**Cause** : `DATABASE_URL` incorrecte

**Solution** :
1. Vérifier que PostgreSQL est bien ajouté au projet
2. Vérifier que `DATABASE_URL` référence bien `${{Postgres.DATABASE_URL}}`
3. Redéployer

### Problème 4 : Build timeout

**Cause** : Build trop long (limite Railway : 10 min)

**Solution** :
1. Utiliser le cache de Railway
2. Optimiser les dépendances
3. Augmenter le timeout dans les settings

## 📊 Monitoring

### Logs

Railway fournit des logs en temps réel :
1. Cliquer sur un service
2. Aller dans **"Deployments"**
3. Cliquer sur le déploiement actif
4. Voir les logs en temps réel

### Métriques

Railway affiche automatiquement :
- CPU usage
- Memory usage
- Network traffic
- Request count

## 🔄 Déploiement Continu

Railway redéploie automatiquement à chaque push sur la branche `main` :

```bash
git add .
git commit -m "Update game logic"
git push origin main
```

Railway va :
1. Détecter le push
2. Builder les services modifiés
3. Déployer automatiquement
4. Effectuer un health check

## 💰 Coûts Estimés

Railway offre :
- **$5 de crédit gratuit/mois**
- **500h d'exécution gratuite**

Coûts estimés pour Aviator :
- PostgreSQL : ~$5/mois
- Backend : ~$5/mois (si actif 24/7)
- Frontend : ~$5/mois (si actif 24/7)

**Total** : ~$15/mois (après les crédits gratuits)

## 🎯 Optimisations Production

### 1. Activer le Sleep Mode

Pour économiser, activer le sleep après inactivité :
1. Settings → Sleep Mode
2. Activer après 30 min d'inactivité

### 2. Configurer les Replicas

Pour la haute disponibilité :
1. Settings → Replicas
2. Augmenter à 2+ instances

### 3. Ajouter un CDN

Pour améliorer les performances :
1. Utiliser Cloudflare devant Railway
2. Configurer le caching

## 📝 Checklist Finale

Avant de mettre en production :

- [ ] `JWT_SECRET` est un secret fort et unique
- [ ] `NEXT_PUBLIC_WS_URL` pointe vers le bon backend
- [ ] Database est initialisée (`prisma db push`)
- [ ] Health check backend répond 200
- [ ] Frontend se connecte au WebSocket
- [ ] Jeu fonctionne (placer un pari, cashout)
- [ ] Logs ne montrent pas d'erreurs
- [ ] Variables d'environnement sont toutes définies

## 🆘 Support

En cas de problème :
1. Consulter les logs Railway
2. Vérifier la documentation : [docs.railway.app](https://docs.railway.app)
3. Rejoindre le Discord Railway
4. Ouvrir une issue GitHub

---

**Bon déploiement ! 🚀**
