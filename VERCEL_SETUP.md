# Configuration Vercel pour Aviator Game

## ⚙️ Configuration du projet Vercel

Lors de l'import du projet sur Vercel, utilisez ces paramètres :

### 1. Root Directory
**IMPORTANT :** Définir le Root Directory sur `apps/web`

### 2. Framework Preset
- **Framework:** Next.js
- **Détection automatique:** Oui

### 3. Build & Development Settings
- **Build Command:** `pnpm prisma generate && pnpm build`
- **Output Directory:** `.next` (par défaut)
- **Install Command:** `pnpm install`
- **Development Command:** `pnpm dev`

### 4. Variables d'environnement

Ajouter ces variables dans Vercel Dashboard → Settings → Environment Variables :

```env
# Base de données (obligatoire)
DATABASE_URL=postgresql://user:password@host:5432/aviator

# URL du serveur WebSocket (obligatoire)
NEXT_PUBLIC_WS_URL=wss://aviator-server.onrender.com

# URL de l'application (optionnel, Vercel le définit automatiquement)
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
```

## 🚀 Déploiement

1. **Connecter le repo GitHub**
   - Aller sur vercel.com
   - New Project → Import Git Repository
   - Sélectionner `zefparis/aviator-1`

2. **Configurer le Root Directory**
   - Dans "Configure Project"
   - Root Directory → `apps/web`
   - Cliquer sur "Edit"

3. **Ajouter les variables d'environnement**
   - Ajouter `DATABASE_URL`
   - Ajouter `NEXT_PUBLIC_WS_URL`

4. **Déployer**
   - Cliquer sur "Deploy"
   - Vercel va build et déployer automatiquement

## 🔄 Redéploiement

Chaque push sur `main` déclenche automatiquement un nouveau déploiement.

Pour forcer un redéploiement :
```bash
git commit --allow-empty -m "chore: Trigger Vercel redeploy"
git push origin main
```

## 🐛 Dépannage

### Erreur "No Next.js version detected"
- Vérifier que Root Directory = `apps/web`
- Vérifier que `next` est dans package.json dependencies

### Erreur Prisma
- Vérifier que `DATABASE_URL` est défini
- Vérifier que la commande de build inclut `prisma generate`

### Erreur de build
- Vérifier les logs dans Vercel Dashboard
- Vérifier que toutes les dépendances sont installées
