# 🚀 Déploiement Aviator Game

## Architecture de déploiement

- **Frontend (Next.js)** → Vercel
- **Backend (WebSocket)** → Render.com
- **Database** → Render PostgreSQL (ou Supabase)

---

## 📦 Déploiement Frontend sur Vercel

### 1. Connecter le repo à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New Project"
3. Importer `zefparis/aviator-1`
4. Vercel détectera automatiquement Next.js

### 2. Configuration Vercel

**Framework Preset:** Next.js  
**Root Directory:** `apps/web`  
**Build Command:** `pnpm turbo run build --filter=@aviator/web`  
**Output Directory:** `apps/web/.next`  
**Install Command:** `pnpm install --frozen-lockfile`

### 3. Variables d'environnement Vercel

```env
DATABASE_URL=postgresql://user:password@host:5432/aviator
NEXT_PUBLIC_WS_URL=wss://aviator-server.onrender.com
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
```

---

## 🔧 Déploiement Backend sur Render.com

### 1. Créer un compte Render

1. Aller sur [render.com](https://render.com)
2. Créer un compte gratuit
3. Connecter votre compte GitHub

### 2. Créer un Web Service

1. Cliquer sur "New +" → "Web Service"
2. Connecter le repo `zefparis/aviator-1`
3. Configurer :

**Name:** `aviator-server`  
**Region:** Frankfurt (ou proche de vous)  
**Branch:** `main`  
**Root Directory:** `.` (racine)  
**Runtime:** Node  
**Build Command:** `./build.sh`  
**Start Command:** `cd apps/server && pnpm start`  

### 3. Variables d'environnement Render

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/aviator
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
```

### 4. Créer une base de données PostgreSQL

1. Dans Render, cliquer sur "New +" → "PostgreSQL"
2. Nom: `aviator-db`
3. Plan: Free
4. Copier l'URL de connexion (Internal Database URL)
5. L'ajouter comme `DATABASE_URL` dans le Web Service

---

## 🔄 Alternative : Fly.io pour le Backend

Si Render ne fonctionne pas, utilisez Fly.io :

```bash
# Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# Se connecter
fly auth login

# Créer l'app
fly launch --name aviator-server --region cdg

# Déployer
fly deploy
```

---

## ✅ Vérification du déploiement

### Frontend (Vercel)
- URL: `https://votre-app.vercel.app`
- Vérifier que la page se charge

### Backend (Render)
- URL: `https://aviator-server.onrender.com/health`
- Devrait retourner: `{"status":"ok"}`

### WebSocket
- Tester la connexion depuis le frontend
- Vérifier les logs Render pour voir les connexions

---

## 🐛 Dépannage

### Le build Vercel échoue
- Vérifier que `DATABASE_URL` est défini
- Vérifier les logs de build

### Le serveur Render ne démarre pas
- Vérifier les logs : Dashboard → Logs
- Vérifier que `DATABASE_URL` est correct
- Vérifier que le healthcheck `/health` répond

### WebSocket ne se connecte pas
- Vérifier que `NEXT_PUBLIC_WS_URL` pointe vers Render
- Vérifier les CORS dans `apps/server/src/index.ts`
- Utiliser `wss://` et non `ws://` en production

---

## 📝 Notes importantes

1. **Render Free Tier** : Le serveur s'endort après 15 min d'inactivité
2. **Cold Start** : Premier démarrage peut prendre 30-60 secondes
3. **Base de données** : Render Free PostgreSQL a une limite de 1GB
4. **Alternative DB** : Utilisez Supabase pour une meilleure performance

---

**Créé le 14 octobre 2025**
