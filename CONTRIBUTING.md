# 🤝 Guide de Contribution - Aviator Game

Merci de votre intérêt pour contribuer à Aviator Game ! Ce document explique comment contribuer au projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Structure du Projet](#structure-du-projet)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)

## 🤝 Code de Conduite

Ce projet adhère à un code de conduite. En participant, vous vous engagez à respecter ce code.

### Nos Engagements

- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté

## 🚀 Comment Contribuer

### Signaler un Bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure :
   - Description claire du bug
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, Node version, etc.)

### Proposer une Fonctionnalité

1. Créer une issue avec le template "Feature Request"
2. Décrire la fonctionnalité et son utilité
3. Attendre les retours de la communauté
4. Une fois approuvée, vous pouvez commencer à travailler dessus

### Améliorer la Documentation

La documentation peut toujours être améliorée ! N'hésitez pas à :
- Corriger les fautes de frappe
- Clarifier des sections confuses
- Ajouter des exemples
- Traduire la documentation

## 📁 Structure du Projet

```
aviator-game/
├── apps/
│   ├── web/              # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/      # Routes Next.js
│   │   │   ├── components/ # Composants React
│   │   │   ├── lib/      # Utilitaires
│   │   │   └── store/    # État global (Zustand)
│   │   └── prisma/       # Schéma DB
│   └── server/           # Backend Node.js
│       └── src/
│           ├── game/     # Logique du jeu
│           ├── lib/      # Utilitaires
│           └── index.ts  # Point d'entrée
└── docs/                 # Documentation
```

## 💻 Standards de Code

### TypeScript

- Utiliser TypeScript strict mode
- Typer explicitement les paramètres et retours de fonction
- Éviter `any`, utiliser `unknown` si nécessaire
- Utiliser les interfaces pour les objets complexes

```typescript
// ✅ Bon
interface User {
  id: string;
  username: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Mauvais
function getUser(id: any): any {
  // ...
}
```

### React/Next.js

- Utiliser les composants fonctionnels
- Préférer les hooks aux classes
- Utiliser `'use client'` uniquement quand nécessaire
- Nommer les composants en PascalCase

```typescript
// ✅ Bon
'use client';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Mauvais
export default function button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Styling

- Utiliser Tailwind CSS
- Éviter les styles inline
- Utiliser `cn()` pour combiner les classes

```typescript
// ✅ Bon
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />

// ❌ Mauvais
<div style={{ color: 'red', fontSize: '16px' }} />
```

### Naming Conventions

- **Fichiers** : kebab-case (`game-canvas.tsx`)
- **Composants** : PascalCase (`GameCanvas`)
- **Fonctions** : camelCase (`calculateMultiplier`)
- **Constants** : UPPER_SNAKE_CASE (`MAX_BET_AMOUNT`)
- **Types/Interfaces** : PascalCase (`GameState`, `BetData`)

### Commits

Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
feat: ajouter le système de leaderboard
fix: corriger le bug de cashout
docs: mettre à jour le README
style: formater le code
refactor: simplifier la logique de jeu
test: ajouter tests pour GameEngine
chore: mettre à jour les dépendances
```

## 🔄 Processus de Pull Request

### 1. Fork et Clone

```bash
# Fork le repo sur GitHub
git clone https://github.com/votre-username/aviator-game.git
cd aviator-game
```

### 2. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### 3. Développer

```bash
# Installer les dépendances
pnpm install

# Lancer en dev
pnpm dev

# Faire vos modifications
# ...

# Tester
pnpm build
```

### 4. Commiter

```bash
git add .
git commit -m "feat: ajouter ma fonctionnalité"
```

### 5. Push

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

### 6. Créer la Pull Request

1. Aller sur GitHub
2. Cliquer sur "New Pull Request"
3. Remplir le template de PR :
   - Description claire des changements
   - Screenshots si UI
   - Tests effectués
   - Breaking changes si applicable

### 7. Review

- Répondre aux commentaires
- Faire les modifications demandées
- Attendre l'approbation

### Checklist PR

Avant de soumettre votre PR, vérifier que :

- [ ] Le code compile sans erreur (`pnpm build`)
- [ ] Le code suit les standards du projet
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Les commits suivent Conventional Commits
- [ ] Pas de console.log oubliés
- [ ] Pas de code commenté inutile
- [ ] Les types TypeScript sont corrects

## 🧪 Tests

### Écrire des Tests

```typescript
// apps/web/src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCrashPoint } from '../utils';

describe('calculateCrashPoint', () => {
  it('should return a value between 1.01 and 100', () => {
    const result = calculateCrashPoint('test-seed');
    expect(result).toBeGreaterThanOrEqual(1.01);
    expect(result).toBeLessThanOrEqual(100);
  });
});
```

### Lancer les Tests

```bash
pnpm test
```

## 📝 Documentation

### JSDoc

Documenter les fonctions complexes :

```typescript
/**
 * Calcule le crash point à partir d'un seed
 * Utilise SHA-256 pour garantir l'équité
 * 
 * @param seed - Le seed unique du round
 * @returns Le multiplicateur de crash entre 1.01 et 100.00
 * 
 * @example
 * const crashPoint = calculateCrashPoint('abc123');
 * console.log(crashPoint); // 2.45
 */
export function calculateCrashPoint(seed: string): number {
  // ...
}
```

## 🎨 Design

### Principes UI/UX

- **Responsive** : Mobile-first
- **Accessible** : ARIA labels, keyboard navigation
- **Performance** : Lazy loading, optimisations
- **Cohérent** : Suivre le design system

### Couleurs

```typescript
// Utiliser les variables CSS
bg-background    // Fond principal
text-foreground  // Texte principal
border-border    // Bordures
text-muted-foreground // Texte secondaire
```

## 🐛 Debugging

### Logs

```typescript
// ✅ Bon - Logs structurés
console.log('[GameEngine] Round started:', { roundId, crashPoint });

// ❌ Mauvais
console.log('round started');
```

### Erreurs

```typescript
// ✅ Bon - Erreurs typées
class GameError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'GameError';
  }
}

throw new GameError('Invalid bet amount', 'INVALID_BET');

// ❌ Mauvais
throw new Error('error');
```

## 📞 Contact

- **Issues** : [GitHub Issues](../../issues)
- **Discussions** : [GitHub Discussions](../../discussions)
- **Email** : contact@congogaming.com

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible !

---

**Bon code ! 💻**
