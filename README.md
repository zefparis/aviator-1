# 🎮 Aviator Game V2 - Congo Gaming

Jeu de crash multiplayer en temps réel avec Next.js 14 et Node.js. Version moderne et optimisée pour le déploiement sur Railway.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Stack Technologique

### Frontend
- **Next.js 14** (App Router) - Framework React moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations fluides
- **Zustand** - Gestion d'état
- **Socket.io Client** - Communication temps réel

### Backend
- **Node.js** + **Express** - Serveur HTTP
- **Socket.io** - WebSocket temps réel
- **Prisma** - ORM moderne
- **PostgreSQL** - Base de données
- **TypeScript** - Typage complet

## 📁 Structure du Projet

```
aviator-game/
├── apps/
│   ├── web/              # Frontend Next.js 14
│   │   ├── src/
│   │   │   ├── app/      # Pages Next.js
│   │   │   ├── components/ # Composants React
│   │   │   ├── lib/      # Utilitaires
│   │   │   └── store/    # Zustand stores
│   │   └── prisma/       # Schéma DB
│   └── server/           # Backend Node.js
│       └── src/
│           ├── game/     # Moteur de jeu
│           └── lib/      # Utilitaires
├── package.json          # Root package
├── turbo.json           # Configuration Turbo
└── railway.toml         # Configuration Railway
```

## 🛠️ Installation Locale

### Prérequis
- Node.js 18+
- pnpm 8+
- PostgreSQL 15+

### Étapes

1. **Cloner le repository**
```bash
git clone <repo-url>
cd aviator-game
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**

Créer `.env` dans `apps/web/` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aviator"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

Créer `.env` dans `apps/server/` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aviator"
JWT_SECRET="your-secret-key"
PORT=3001
```

4. **Initialiser la base de données**
```bash
cd apps/web
pnpm prisma db push
```

5. **Lancer en développement**
```bash
# Terminal 1 - Backend
cd apps/server
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

6. **Ouvrir le navigateur**
```
http://localhost:3000
```

## 🚂 Déploiement sur Railway

### Méthode 1 : Via CLI

1. **Installer Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Créer un nouveau projet**
```bash
railway init
```

4. **Ajouter PostgreSQL**
```bash
railway add postgresql
```

5. **Configurer les variables d'environnement**
```bash
railway variables set JWT_SECRET="your-production-secret"
railway variables set NEXT_PUBLIC_WS_URL="https://your-server.railway.app"
```

6. **Déployer**
```bash
railway up
```

### Méthode 2 : Via Dashboard

1. Aller sur [railway.app](https://railway.app)
2. Créer un nouveau projet
3. Connecter votre repo GitHub
4. Ajouter PostgreSQL depuis le marketplace
5. Configurer les variables d'environnement :
   - `DATABASE_URL` (auto-généré par Railway)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_WS_URL`
   - `PORT=3001`
6. Railway détectera automatiquement `railway.toml` et déploiera

## 🎮 Fonctionnalités

### ✅ Implémentées
- ✅ Jeu en temps réel avec Socket.io
- ✅ Système de paris et cashout
- ✅ Algorithme "Provably Fair" (SHA-256)
- ✅ Animations fluides (Framer Motion)
- ✅ Historique des rounds
- ✅ Statistiques en temps réel
- ✅ Auto-cashout configurable
- ✅ Interface responsive

### 🔜 À Venir
- 🔜 Authentification JWT
- 🔜 Système de leaderboard
- 🔜 Chat en temps réel
- 🔜 Historique des paris utilisateur
- 🔜 Système de niveaux/achievements
- 🔜 Mode démo (sans argent réel)

## 🔐 Sécurité

- ✅ Validation des entrées avec Zod
- ✅ Système provably fair vérifiable
- ✅ Variables d'environnement sécurisées
- ✅ CORS configuré
- ⚠️ À ajouter : Rate limiting
- ⚠️ À ajouter : Authentification JWT

## 📊 Base de Données

### Schéma Prisma

```prisma
model User {
  id       String  @id @default(cuid())
  username String  @unique
  balance  Decimal @default(1000.00)
  bets     Bet[]
}

model GameRound {
  id         String      @id @default(cuid())
  seed       String      @unique
  crashPoint Decimal
  status     RoundStatus
  bets       Bet[]
}

model Bet {
  id                String    @id @default(cuid())
  userId            String
  roundId           String
  amount            Decimal
  cashoutMultiplier Decimal?
  status            BetStatus
  winAmount         Decimal
}
```

## 🧪 Tests

```bash
# Tests unitaires (à implémenter)
pnpm test

# Tests E2E (à implémenter)
pnpm test:e2e
```

## 📝 Scripts Disponibles

```bash
# Développement
pnpm dev              # Lance tous les services
pnpm dev:web          # Frontend uniquement
pnpm dev:server       # Backend uniquement

# Production
pnpm build            # Build tous les services
pnpm start            # Lance en production

# Base de données
pnpm db:push          # Sync schema Prisma
pnpm db:studio        # Ouvre Prisma Studio

# Nettoyage
pnpm clean            # Supprime node_modules et build
```

## 🐛 Debugging

### Problèmes courants

**1. Socket.io ne se connecte pas**
- Vérifier que `NEXT_PUBLIC_WS_URL` pointe vers le bon serveur
- Vérifier que le serveur backend est lancé sur le bon port

**2. Erreur Prisma**
- Exécuter `pnpm prisma generate`
- Vérifier que `DATABASE_URL` est correcte

**3. Build échoue sur Railway**
- Vérifier que toutes les variables d'environnement sont définies
- Consulter les logs Railway

## 📄 License

MIT © Congo Gaming

## 👥 Contributeurs

- Développeur principal : [Votre nom]

## 🔗 Liens Utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Socket.io](https://socket.io/docs/)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Railway](https://docs.railway.app)

---

**Congo Gaming** - Jeu responsable 🎮
