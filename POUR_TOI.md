# 👋 Hey ! Voici ton nouveau projet Aviator

## 🎯 TL;DR - Ce qui a changé

**Avant (v1)** : React Native + 4 services backend séparés + Docker/K8s
**Maintenant (v2)** : Next.js 14 + 1 backend unifié + Railway

**Résultat** : Code 10x plus propre, déploiement 100x plus simple ! 🚀

---

## ⚡ Démarrage Ultra-Rapide

```bash
# 1. Installer tout
chmod +x INSTALL.sh
./INSTALL.sh

# 2. Lancer
pnpm dev

# 3. Ouvrir
# http://localhost:3000
```

**C'est tout ! 🎉**

---

## 🤔 Pourquoi cette refonte ?

### Problèmes de l'ancien code

1. **React Native pour le web** ❌
   - Tu voulais déployer sur Railway
   - React Native ne tourne pas sur un serveur web
   - C'était fait pour mobile

2. **Services fantômes** ❌
   - `websocket-gateway` : n'existait pas
   - `analytics-service` : n'existait pas
   - docker-compose définissait 4 services, seulement 2 existaient

3. **Socket.io vs WebSocket natif** ❌
   - Frontend utilisait Socket.io
   - Backend utilisait `ws` (natif)
   - Totalement incompatibles !

4. **Mix JS/TS** ❌
   - Certains fichiers en JS, d'autres en TS
   - Pas de cohérence

5. **Pas de migrations DB** ❌
   - schema.sql jamais exécuté
   - Pas de système de migrations

### Solutions apportées

1. **Next.js 14** ✅
   - Tourne sur Railway
   - SSR/SSG natif
   - Performance optimale
   - SEO-friendly

2. **Backend unifié** ✅
   - 1 seul service Node.js
   - Auth + Game + WebSocket ensemble
   - Plus simple à maintenir

3. **Socket.io partout** ✅
   - Client et serveur utilisent Socket.io
   - Compatible et stable

4. **100% TypeScript** ✅
   - Tout le code en TS
   - Typage strict
   - Moins de bugs

5. **Prisma ORM** ✅
   - Migrations automatiques
   - Type-safe
   - Moderne

---

## 📁 Où est quoi ?

### Frontend (apps/web/)
```
src/
├── app/
│   ├── page.tsx          ← Page principale
│   └── layout.tsx        ← Layout global
├── components/game/
│   ├── GameCanvas.tsx    ← Affichage du jeu
│   ├── BetControls.tsx   ← Boutons de pari
│   ├── GameStats.tsx     ← Statistiques
│   └── GameHistory.tsx   ← Historique
├── lib/
│   ├── socket.ts         ← Client WebSocket
│   └── utils.ts          ← Fonctions utiles
└── store/
    └── gameStore.ts      ← État global (Zustand)
```

### Backend (apps/server/)
```
src/
├── index.ts              ← Point d'entrée
├── game/
│   └── GameEngine.ts     ← Toute la logique du jeu
└── lib/
    ├── prisma.ts         ← Client DB
    └── utils.ts          ← Fonctions utiles
```

**Simple, non ?** 😎

---

## 🎮 Comment ça marche ?

### Flow du jeu

1. **Joueur ouvre le site** → Frontend se connecte au WebSocket
2. **Round commence** → Backend broadcast "round:start"
3. **Multiplicateur monte** → Backend broadcast "round:update" toutes les 100ms
4. **Joueur cashout** → Client envoie "bet:cashout"
5. **Avion crash** → Backend broadcast "round:end"
6. **Nouveau round** → Retour à l'étape 2

### Architecture temps réel

```
Frontend (Next.js)
    ↕ Socket.io
Backend (Node.js)
    ↕ Prisma
PostgreSQL
```

**Tout est synchronisé en temps réel !** ⚡

---

## 🚀 Déployer sur Railway

### Méthode Simple (Dashboard)

1. Va sur [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Sélectionne ton repo
4. Ajoute PostgreSQL
5. Configure les variables (voir DEPLOY.md)
6. Deploy !

**Temps estimé : 10 minutes** ⏱️

### Variables à configurer

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto
JWT_SECRET=ton-secret-super-securise     # À changer !
NEXT_PUBLIC_WS_URL=https://ton-server.railway.app
PORT=3001
```

**Voir DEPLOY.md pour le guide complet** 📖

---

## 💡 Conseils pour Congo Gaming

### Phase 1 : Test (maintenant)
1. Lance en local
2. Teste le jeu
3. Vérifie que tout fonctionne

### Phase 2 : Déploiement (cette semaine)
1. Push sur GitHub
2. Déploie sur Railway
3. Configure un domaine

### Phase 3 : Production (ce mois)
1. Ajoute l'authentification JWT
2. Implémente le système de paiement
3. Ajoute le leaderboard

### Phase 4 : Évolution (plus tard)
1. App mobile (React Native)
2. Chat en temps réel
3. Système d'achievements

---

## 🐛 Si ça marche pas

### "Cannot connect to WebSocket"
→ Vérifie que le backend tourne sur le bon port
→ Regarde `NEXT_PUBLIC_WS_URL` dans `.env`

### "Prisma Client not generated"
→ Lance `cd apps/web && pnpm prisma generate`

### "Port already in use"
→ Change le port dans `.env` : `PORT=3002`

### "Database connection failed"
→ Vérifie que PostgreSQL tourne
→ Vérifie `DATABASE_URL` dans `.env`

**Voir README.md section Debugging** 🔍

---

## 📚 Documentation

Tous les fichiers sont dans le projet :

- **SUMMARY.md** ← Résumé complet (commence ici !)
- **README.md** ← Documentation technique
- **QUICKSTART.md** ← Démarrage rapide
- **DEPLOY.md** ← Guide Railway détaillé
- **CHANGELOG.md** ← Historique des versions

---

## 🎯 Prochaines étapes

### Aujourd'hui
- [ ] Lire SUMMARY.md
- [ ] Lancer `./INSTALL.sh`
- [ ] Tester le jeu en local
- [ ] Lire DEPLOY.md

### Cette semaine
- [ ] Push sur GitHub
- [ ] Déployer sur Railway
- [ ] Tester en production
- [ ] Configurer un domaine

### Ce mois
- [ ] Ajouter l'authentification
- [ ] Implémenter les paiements
- [ ] Ajouter le leaderboard
- [ ] Marketing !

---

## 💰 Coûts Railway

- **Gratuit** : $5 de crédit/mois + 500h
- **Après** : ~$15/mois (PostgreSQL + 2 services)

**Largement suffisant pour commencer !** 💸

---

## 🆘 Besoin d'aide ?

### Commandes utiles
```bash
make help          # Voir toutes les commandes
make dev           # Lancer en dev
make docker-up     # Lancer PostgreSQL
make db-studio     # Ouvrir Prisma Studio
```

### Documentation
- README.md
- DEPLOY.md
- QUICKSTART.md

### Support
- GitHub Issues
- Email : contact@congogaming.com

---

## ✅ Checklist Finale

Avant de commencer :
- [ ] Node.js 18+ installé
- [ ] pnpm installé
- [ ] Git configuré
- [ ] Compte Railway créé (si déploiement)

Installation :
- [ ] `./INSTALL.sh` exécuté
- [ ] PostgreSQL lancé
- [ ] `pnpm dev` fonctionne
- [ ] http://localhost:3000 accessible

Test :
- [ ] Placer un pari ✓
- [ ] Cashout ✓
- [ ] Voir l'historique ✓
- [ ] WebSocket connecté ✓

---

## 🎉 C'est parti !

Tu as maintenant un projet **moderne**, **propre** et **déployable** !

**Plus d'excuses, lance-toi ! 🚀**

```bash
./INSTALL.sh
pnpm dev
```

**Bon code ! 💻**

---

*P.S. : Si tu as des questions, lis SUMMARY.md, tout y est ! 📖*
