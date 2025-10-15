# 🚂 Déployer le Backend sur Railway

## Prérequis
- Compte Railway : [railway.app](https://railway.app)
- Base de données Railway déjà créée ✅

## 📋 Étapes de déploiement

### 1. Créer un nouveau service

1. Aller sur [railway.app/dashboard](https://railway.app/dashboard)
2. Sélectionner votre projet (ou créer un nouveau)
3. **New** → **GitHub Repo**
4. Sélectionner `zefparis/aviator-1`

### 2. Configuration automatique

Railway va détecter automatiquement :
- ✅ `nixpacks.toml` - Configuration de build
- ✅ `railway.json` - Configuration de déploiement
- ✅ `build.sh` - Script de build

### 3. Variables d'environnement

Ajouter dans Railway Dashboard → Variables :

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**Note :** Si votre base de données Railway est dans le même projet, utilisez `${{Postgres.DATABASE_URL}}` pour référencer automatiquement.

Sinon, utilisez l'URL complète :
```env
DATABASE_URL=postgresql://postgres:password@ballast.proxy.rlwy.net:40463/railway
```

### 4. Déployer

Railway va automatiquement :
1. ✅ Installer les dépendances avec pnpm
2. ✅ Générer le client Prisma
3. ✅ Compiler TypeScript
4. ✅ Démarrer le serveur
5. ✅ Vérifier le healthcheck `/health`

### 5. Obtenir l'URL du backend

Une fois déployé :
1. Aller dans **Settings** → **Networking**
2. Cliquer sur **Generate Domain**
3. Copier l'URL (ex: `aviator-server-production.up.railway.app`)

### 6. Mettre à jour Vercel

Dans Vercel → Environment Variables :

```env
NEXT_PUBLIC_WS_URL=wss://aviator-server-production.up.railway.app
```

**Important :** Utilisez `wss://` (WebSocket Secure) et non `ws://`

## 🔍 Vérification

### Tester le healthcheck
```bash
curl https://aviator-server-production.up.railway.app/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "2025-10-15T...",
  "service": "aviator-server"
}
```

### Tester la connexion WebSocket

Depuis le frontend, la connexion devrait s'établir automatiquement.

## 🐛 Dépannage

### Le build échoue
- Vérifier les logs dans Railway Dashboard
- Vérifier que `DATABASE_URL` est défini
- Vérifier que le build local fonctionne : `./build.sh`

### Le healthcheck échoue
- Vérifier que le serveur démarre : voir les logs
- Vérifier que le port 3001 est utilisé
- Vérifier que `/health` répond

### WebSocket ne se connecte pas
- Vérifier l'URL dans `NEXT_PUBLIC_WS_URL`
- Utiliser `wss://` et non `ws://`
- Vérifier les CORS dans `apps/server/src/index.ts`

## 📊 Architecture finale

```
┌─────────────┐
│   Vercel    │  Frontend Next.js
│  (Frontend) │  https://aviator.vercel.app
└──────┬──────┘
       │
       │ WebSocket (wss://)
       │
┌──────▼──────┐
│   Railway   │  Backend Node.js + Socket.io
│  (Backend)  │  https://aviator-server.up.railway.app
└──────┬──────┘
       │
       │ PostgreSQL
       │
┌──────▼──────┐
│   Railway   │  Database PostgreSQL
│ (Database)  │  ballast.proxy.rlwy.net:40463
└─────────────┘
```

## ✅ Checklist finale

- [ ] Backend déployé sur Railway
- [ ] Healthcheck `/health` répond
- [ ] Domain généré et copié
- [ ] `NEXT_PUBLIC_WS_URL` mis à jour dans Vercel
- [ ] `DATABASE_URL` configuré dans Railway
- [ ] Frontend redéployé sur Vercel
- [ ] WebSocket se connecte depuis le frontend
- [ ] Le jeu fonctionne ! 🎮

---

**Créé le 15 octobre 2025**
