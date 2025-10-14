# 📂 Structure du Projet - Aviator Game V2

## 🌳 Arborescence Complète

```
aviator-game/
│
├── 📁 apps/                          # Monorepo applications
│   ├── 📁 web/                       # Frontend Next.js 14
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/               # Next.js App Router
│   │   │   │   ├── layout.tsx        # Layout principal (dark mode)
│   │   │   │   ├── page.tsx          # Page d'accueil (jeu)
│   │   │   │   └── globals.css       # Styles Tailwind
│   │   │   │
│   │   │   ├── 📁 components/game/   # Composants du jeu
│   │   │   │   ├── GameContainer.tsx # Conteneur principal + Socket.io
│   │   │   │   ├── GameCanvas.tsx    # Canvas HTML5 + animations
│   │   │   │   ├── BetControls.tsx   # Contrôles de paris
│   │   │   │   ├── GameStats.tsx     # Statistiques temps réel
│   │   │   │   └── GameHistory.tsx   # Historique des rounds
│   │   │   │
│   │   │   ├── 📁 lib/               # Utilitaires
│   │   │   │   ├── prisma.ts         # Client Prisma
│   │   │   │   ├── socket.ts         # Service Socket.io client
│   │   │   │   └── utils.ts          # Fonctions utiles
│   │   │   │
│   │   │   └── 📁 store/             # État global
│   │   │       └── gameStore.ts      # Zustand store
│   │   │
│   │   ├── 📁 prisma/                # Base de données
│   │   │   └── schema.prisma         # Schéma complet (User, GameRound, Bet)
│   │   │
│   │   ├── 📁 public/                # Assets statiques
│   │   │   └── favicon.ico
│   │   │
│   │   ├── package.json              # Dépendances frontend
│   │   ├── tsconfig.json             # Config TypeScript
│   │   ├── tailwind.config.ts        # Config Tailwind
│   │   ├── next.config.js            # Config Next.js
│   │   ├── postcss.config.js         # Config PostCSS
│   │   ├── .eslintrc.json            # Config ESLint
│   │   ├── .env.example              # Variables d'environnement
│   │   └── .env                      # Variables locales (gitignored)
│   │
│   └── 📁 server/                    # Backend Node.js
│       ├── 📁 src/
│       │   ├── 📁 game/              # Logique du jeu
│       │   │   └── GameEngine.ts     # Moteur de jeu complet
│       │   │                         # - Boucle de jeu
│       │   │                         # - Provably Fair
│       │   │                         # - Gestion des paris
│       │   │                         # - Broadcast WebSocket
│       │   │
│       │   ├── 📁 lib/               # Utilitaires
│       │   │   ├── prisma.ts         # Client Prisma
│       │   │   └── utils.ts          # Fonctions utiles
│       │   │
│       │   └── index.ts              # Point d'entrée
│       │                             # - Express server
│       │                             # - Socket.io setup
│       │                             # - API routes
│       │
│       ├── 📁 prisma/
│       │   └── schema.prisma         # Symlink vers web/prisma
│       │
│       ├── package.json              # Dépendances backend
│       ├── tsconfig.json             # Config TypeScript
│       ├── .env.example              # Variables d'environnement
│       └── .env                      # Variables locales (gitignored)
│
├── 📁 frontend/                      # ⚠️ ANCIEN CODE (React Native)
│   └── ...                           # À SUPPRIMER (deprecated)
│
├── 📁 backend/                       # ⚠️ ANCIEN CODE (microservices)
│   └── ...                           # À SUPPRIMER (deprecated)
│
├── 📁 AviatorApp/                    # ⚠️ ANCIEN CODE
│   └── ...                           # À SUPPRIMER (deprecated)
│
├── 📄 package.json                   # Root package (monorepo)
├── 📄 pnpm-workspace.yaml            # Configuration pnpm workspaces
├── 📄 turbo.json                     # Configuration Turbo
│
├── 📄 railway.toml                   # Configuration Railway
├── 📄 nixpacks.toml                  # Configuration build Railway
├── 📄 docker-compose.dev.yml         # PostgreSQL local (dev)
│
├── 📄 .gitignore                     # Git ignore (mis à jour)
├── 📄 .env.example                   # Variables d'environnement
├── 📄 .prettierrc                    # Configuration Prettier
├── 📄 .prettierignore                # Prettier ignore
│
├── 📄 README.md                      # 📖 Documentation principale
├── 📄 SUMMARY.md                     # 📊 Résumé complet du projet
├── 📄 POUR_TOI.md                    # 👋 Guide personnel
├── 📄 QUICKSTART.md                  # ⚡ Guide rapide
├── 📄 DEPLOY.md                      # 🚀 Guide Railway
├── 📄 CHANGELOG.md                   # 📝 Historique des versions
├── 📄 CONTRIBUTING.md                # 🤝 Guide de contribution
├── 📄 LICENSE                        # 📄 Licence MIT
│
├── 📄 setup.sh                       # 🔧 Script d'installation
├── 📄 INSTALL.sh                     # ⚡ Installation automatique
└── 📄 Makefile                       # 🛠️ Commandes utiles
```

---

## 📊 Statistiques du Projet

### Fichiers Créés (V2)
- **Frontend** : 13 fichiers TypeScript/TSX
- **Backend** : 4 fichiers TypeScript
- **Configuration** : 15 fichiers
- **Documentation** : 8 fichiers Markdown
- **Scripts** : 3 fichiers shell/Makefile

**Total** : ~43 nouveaux fichiers

### Lignes de Code (estimation)
- **Frontend** : ~1,500 lignes
- **Backend** : ~500 lignes
- **Config** : ~300 lignes
- **Documentation** : ~2,000 lignes

**Total** : ~4,300 lignes

---

## 🎯 Fichiers Importants

### À Lire en Premier
1. **POUR_TOI.md** - Guide personnel
2. **SUMMARY.md** - Résumé complet
3. **README.md** - Documentation technique

### Pour Démarrer
1. **INSTALL.sh** - Installation automatique
2. **QUICKSTART.md** - Guide rapide
3. **.env.example** - Variables d'environnement

### Pour Déployer
1. **DEPLOY.md** - Guide Railway complet
2. **railway.toml** - Configuration Railway
3. **nixpacks.toml** - Configuration build

### Pour Développer
1. **apps/web/src/** - Code frontend
2. **apps/server/src/** - Code backend
3. **Makefile** - Commandes utiles

---

## 🗂️ Organisation par Fonctionnalité

### 🎮 Logique du Jeu
```
apps/server/src/game/GameEngine.ts    # Moteur principal
apps/server/src/lib/utils.ts          # Calculs (crash point, etc.)
apps/web/src/store/gameStore.ts       # État global
```

### 🎨 Interface Utilisateur
```
apps/web/src/components/game/
├── GameCanvas.tsx      # Affichage visuel
├── BetControls.tsx     # Interactions utilisateur
├── GameStats.tsx       # Informations
└── GameHistory.tsx     # Historique
```

### 🔌 Communication Temps Réel
```
apps/web/src/lib/socket.ts            # Client Socket.io
apps/server/src/index.ts              # Serveur Socket.io
apps/server/src/game/GameEngine.ts    # Broadcast events
```

### 💾 Base de Données
```
apps/web/prisma/schema.prisma         # Schéma principal
apps/web/src/lib/prisma.ts            # Client Prisma
apps/server/src/lib/prisma.ts         # Client Prisma
```

### ⚙️ Configuration
```
apps/web/next.config.js               # Next.js
apps/web/tailwind.config.ts           # Tailwind
apps/web/tsconfig.json                # TypeScript (web)
apps/server/tsconfig.json             # TypeScript (server)
turbo.json                            # Turbo (monorepo)
```

---

## 🚀 Flow de Développement

### 1. Modifier le Frontend
```bash
# Éditer les composants
apps/web/src/components/game/*.tsx

# Le hot reload fonctionne automatiquement
# Voir les changements sur http://localhost:3000
```

### 2. Modifier le Backend
```bash
# Éditer la logique
apps/server/src/game/GameEngine.ts

# Le serveur redémarre automatiquement (tsx watch)
# Tester avec http://localhost:3001/health
```

### 3. Modifier la Base de Données
```bash
# Éditer le schéma
apps/web/prisma/schema.prisma

# Appliquer les changements
cd apps/web
pnpm prisma db push
pnpm prisma generate
```

### 4. Ajouter une Dépendance
```bash
# Frontend
cd apps/web
pnpm add package-name

# Backend
cd apps/server
pnpm add package-name

# Les deux
pnpm add package-name --filter @aviator/web --filter @aviator/server
```

---

## 📦 Dépendances Principales

### Frontend
- `next@14.2.5` - Framework React
- `react@18.3.1` - Library UI
- `socket.io-client@4.7.5` - WebSocket
- `zustand@4.5.4` - State management
- `framer-motion@11.3.24` - Animations
- `@prisma/client@5.18.0` - ORM
- `tailwindcss@3.4.9` - Styling

### Backend
- `express@4.19.2` - HTTP server
- `socket.io@4.7.5` - WebSocket server
- `@prisma/client@5.18.0` - ORM
- `bcryptjs@2.4.3` - Hashing
- `jsonwebtoken@9.0.2` - JWT

### Dev Tools
- `typescript@5.5.4` - Typage
- `tsx@4.16.5` - TypeScript runner
- `turbo@2.0.0` - Monorepo build
- `prisma@5.18.0` - ORM CLI

---

## 🧹 Nettoyage Recommandé

### Supprimer l'Ancien Code
```bash
# Ces dossiers sont deprecated
rm -rf frontend/
rm -rf backend/
rm -rf AviatorApp/
rm -rf .expo/
rm -rf .idea/
rm -rf .vscode/
rm docker-compose.yml  # Ancien Docker Compose
```

### Garder Uniquement
```
aviator-game/
├── apps/              # Nouveau code
├── *.md               # Documentation
├── *.sh               # Scripts
├── Makefile
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── railway.toml
├── nixpacks.toml
├── docker-compose.dev.yml
└── .gitignore
```

---

## 🎯 Prochaines Étapes

1. **Lire** : POUR_TOI.md et SUMMARY.md
2. **Installer** : `./INSTALL.sh`
3. **Tester** : `pnpm dev`
4. **Nettoyer** : Supprimer l'ancien code
5. **Déployer** : Suivre DEPLOY.md

---

**Bon développement ! 🚀**
