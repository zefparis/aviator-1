# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [2.0.0] - 2024-10-14

### 🎉 Refonte Complète

#### Ajouté
- ✨ Architecture Next.js 14 avec App Router
- ✨ Backend Node.js unifié avec Socket.io
- ✨ Système de jeu en temps réel
- ✨ Algorithme Provably Fair (SHA-256)
- ✨ Interface utilisateur moderne avec Tailwind CSS
- ✨ Animations fluides avec Framer Motion
- ✨ Gestion d'état avec Zustand
- ✨ ORM Prisma pour PostgreSQL
- ✨ Configuration Railway pour déploiement
- ✨ Monorepo avec Turbo
- ✨ TypeScript partout
- ✨ Auto-cashout configurable
- ✨ Historique des rounds
- ✨ Statistiques en temps réel

#### Modifié
- 🔄 Migration de React Native vers Next.js
- 🔄 Remplacement de WebSocket natif par Socket.io
- 🔄 Unification des services backend
- 🔄 Nouvelle structure de projet (monorepo)

#### Supprimé
- ❌ React Native frontend (mobile)
- ❌ Services backend séparés (auth, websocket, analytics)
- ❌ Docker Compose (remplacé par Railway)
- ❌ Kubernetes manifests

#### Sécurité
- 🔒 Variables d'environnement sécurisées
- 🔒 CORS configuré
- 🔒 Validation des entrées

### 📝 Notes de Migration

Si vous utilisez la version 1.x :
1. Cette version n'est pas compatible avec v1.x
2. Sauvegardez vos données avant migration
3. Suivez le guide dans DEPLOY.md

## [1.0.0] - 2022-XX-XX (Deprecated)

### Version Initiale
- React Native frontend
- Microservices backend
- Docker + Kubernetes

---

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
