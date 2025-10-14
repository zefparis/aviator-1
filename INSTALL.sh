#!/bin/bash

# Aviator Game - Installation Rapide
# Ce script installe et configure tout automatiquement

set -e

echo "╔════════════════════════════════════════╗"
echo "║   🎮 AVIATOR GAME - INSTALLATION      ║"
echo "║        Congo Gaming                    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour afficher les étapes
step() {
    echo -e "${BLUE}▶ $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Vérifier Node.js
step "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé"
    echo "Installez Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ requis (version actuelle: v$NODE_VERSION)"
    exit 1
fi

success "Node.js $(node -v) détecté"

# Vérifier/Installer pnpm
step "Vérification de pnpm..."
if ! command -v pnpm &> /dev/null; then
    warning "pnpm non trouvé. Installation..."
    npm install -g pnpm
    success "pnpm installé"
else
    success "pnpm $(pnpm -v) détecté"
fi

# Installer les dépendances
step "Installation des dépendances..."
pnpm install
success "Dépendances installées"

# Créer les fichiers .env
step "Configuration des variables d'environnement..."

# Web .env
if [ ! -f "apps/web/.env" ]; then
    cat > apps/web/.env << 'EOF'
DATABASE_URL="postgresql://aviator:aviator@localhost:5432/aviator"
JWT_SECRET="dev-secret-change-in-production"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF
    success "apps/web/.env créé"
else
    warning "apps/web/.env existe déjà"
fi

# Server .env
if [ ! -f "apps/server/.env" ]; then
    cat > apps/server/.env << 'EOF'
DATABASE_URL="postgresql://aviator:aviator@localhost:5432/aviator"
JWT_SECRET="dev-secret-change-in-production"
PORT=3001
NODE_ENV="development"
GAME_ROUND_DURATION=30000
GAME_UPDATE_INTERVAL=100
MIN_BET=1
MAX_BET=10000
EOF
    success "apps/server/.env créé"
else
    warning "apps/server/.env existe déjà"
fi

# Vérifier Docker
step "Vérification de Docker..."
if command -v docker &> /dev/null; then
    success "Docker détecté"
    
    # Demander si on lance PostgreSQL
    echo ""
    read -p "Voulez-vous lancer PostgreSQL avec Docker ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        step "Lancement de PostgreSQL..."
        docker-compose -f docker-compose.dev.yml up -d
        success "PostgreSQL démarré sur localhost:5432"
        
        # Attendre que PostgreSQL soit prêt
        echo "Attente du démarrage de PostgreSQL..."
        sleep 5
        
        # Initialiser la DB
        step "Initialisation de la base de données..."
        cd apps/web
        pnpm prisma generate
        pnpm prisma db push
        cd ../..
        success "Base de données initialisée"
    fi
else
    warning "Docker non détecté"
    echo "Vous devrez configurer PostgreSQL manuellement"
    echo "Ou installer Docker : https://docs.docker.com/get-docker/"
fi

# Résumé
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   ✅ INSTALLATION TERMINÉE !          ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🎉 Aviator Game est prêt !${NC}"
echo ""
echo "📝 Prochaines étapes :"
echo ""
echo "1️⃣  Lancer le backend :"
echo "   cd apps/server"
echo "   pnpm dev"
echo ""
echo "2️⃣  Lancer le frontend (nouveau terminal) :"
echo "   cd apps/web"
echo "   pnpm dev"
echo ""
echo "   OU utiliser Turbo (recommandé) :"
echo "   pnpm dev"
echo ""
echo "🌐 URLs :"
echo "   • Frontend : http://localhost:3000"
echo "   • Backend  : http://localhost:3001"
echo "   • Health   : http://localhost:3001/health"
echo ""
echo "📚 Documentation :"
echo "   • README.md      - Documentation complète"
echo "   • QUICKSTART.md  - Guide rapide"
echo "   • DEPLOY.md      - Déploiement Railway"
echo "   • SUMMARY.md     - Résumé du projet"
echo ""
echo "🆘 Besoin d'aide ?"
echo "   make help"
echo ""
echo -e "${BLUE}Bon développement ! 🚀${NC}"
