#!/usr/bin/env bash

################################################################################
# Aviator Game - Advanced Setup Script
# 
# Description:
#   Automated installation and configuration for Next.js 14 + Node.js monorepo
#   with Prisma, PostgreSQL, and Railway support.
#
# Usage:
#   ./setup.sh [OPTIONS]
#
# Options:
#   --no-docker     Skip Docker PostgreSQL setup
#   --no-install    Skip pnpm install
#   --migrate       Use prisma migrate dev instead of db push
#   --dry-run       Show commands without executing
#   --verbose       Enable debug mode
#   -h, --help      Show this help message
#
# Requirements:
#   - Node.js >= 18
#   - pnpm (via Corepack)
#   - Docker & Docker Compose (optional)
#   - PostgreSQL client tools (optional)
################################################################################

set -Eeuo pipefail

################################################################################
# CONFIGURATION
################################################################################

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="${SCRIPT_DIR}"
readonly MIN_NODE_VERSION=18

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Flags
DRY_RUN=false
VERBOSE=false
NO_DOCKER=false
NO_INSTALL=false
USE_MIGRATE=false
RAILWAY_DETECTED=false
DOCKER_COMPOSE_DETECTED=false

################################################################################
# LOGGING FUNCTIONS
################################################################################

log_info() {
    local timestamp
    timestamp="$(date '+%H:%M:%S')"
    printf "${BLUE}[INFO]${NC} [%s] %s\n" "${timestamp}" "$*"
}

log_success() {
    local timestamp
    timestamp="$(date '+%H:%M:%S')"
    printf "${GREEN}[OK]${NC}   [%s] %s\n" "${timestamp}" "$*"
}

log_warn() {
    local timestamp
    timestamp="$(date '+%H:%M:%S')"
    printf "${YELLOW}[WARN]${NC} [%s] %s\n" "${timestamp}" "$*" >&2
}

log_error() {
    local timestamp
    timestamp="$(date '+%H:%M:%S')"
    printf "${RED}[ERR]${NC}  [%s] %s\n" "${timestamp}" "$*" >&2
}

log_debug() {
    if [[ "${VERBOSE}" == "true" ]]; then
        local timestamp
        timestamp="$(date '+%H:%M:%S')"
        printf "${CYAN}[DEBUG]${NC} [%s] %s\n" "${timestamp}" "$*"
    fi
}

################################################################################
# ERROR HANDLING
################################################################################

cleanup() {
    local exit_code=$?
    if [[ ${exit_code} -ne 0 ]]; then
        log_error "Script failed with exit code ${exit_code}"
        log_error "Check the logs above for details"
    fi
}

trap cleanup EXIT

error_exit() {
    log_error "$1"
    exit "${2:-1}"
}

################################################################################
# UTILITY FUNCTIONS
################################################################################

run_command() {
    local cmd="$*"
    log_debug "Running: ${cmd}"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would execute: ${cmd}"
        return 0
    fi
    
    if [[ "${VERBOSE}" == "true" ]]; then
        eval "${cmd}"
    else
        eval "${cmd}" > /dev/null 2>&1
    fi
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

prompt_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    local response
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would prompt: ${prompt}"
        return 0
    fi
    
    while true; do
        if [[ "${default}" == "y" ]]; then
            printf "%s [Y/n] " "${prompt}"
        else
            printf "%s [y/N] " "${prompt}"
        fi
        
        read -r response
        response="${response:-${default}}"
        
        case "${response}" in
            [Yy]|[Yy][Ee][Ss])
                return 0
                ;;
            [Nn]|[Nn][Oo])
                return 1
                ;;
            *)
                printf "Please answer yes or no.\n"
                ;;
        esac
    done
}

################################################################################
# DETECTION FUNCTIONS
################################################################################

detect_environment() {
    log_info "Detecting project environment..."
    
    # Check for Railway configuration
    if [[ -f "${PROJECT_ROOT}/railway.toml" ]]; then
        RAILWAY_DETECTED=true
        log_debug "Railway configuration detected"
    fi
    
    # Check for Docker Compose
    if [[ -f "${PROJECT_ROOT}/docker-compose.dev.yml" ]]; then
        DOCKER_COMPOSE_DETECTED=true
        log_debug "Docker Compose configuration detected"
    fi
    
    # Check for Turbo monorepo
    if [[ -f "${PROJECT_ROOT}/turbo.json" ]]; then
        log_debug "Turbo monorepo detected"
    fi
    
    log_success "Environment detection complete"
}

################################################################################
# DEPENDENCY CHECKS
################################################################################

check_node() {
    log_info "Checking Node.js version..."
    
    if ! command_exists node; then
        error_exit "Node.js is not installed. Please install Node.js ${MIN_NODE_VERSION}+ from https://nodejs.org"
    fi
    
    local node_version
    node_version="$(node -v | sed 's/v//' | cut -d'.' -f1)"
    
    if [[ ${node_version} -lt ${MIN_NODE_VERSION} ]]; then
        error_exit "Node.js ${MIN_NODE_VERSION}+ required (current: v${node_version})"
    fi
    
    log_success "Node.js $(node -v) detected"
}

check_pnpm() {
    log_info "Checking pnpm..."
    
    if ! command_exists pnpm; then
        log_warn "pnpm not found. Enabling via Corepack..."
        
        if ! command_exists corepack; then
            error_exit "Corepack not available. Please upgrade Node.js or install pnpm manually."
        fi
        
        run_command "corepack enable"
        run_command "corepack prepare pnpm@latest --activate"
        
        if ! command_exists pnpm; then
            error_exit "Failed to enable pnpm via Corepack"
        fi
    fi
    
    log_success "pnpm $(pnpm -v) detected"
}

check_docker() {
    if [[ "${NO_DOCKER}" == "true" ]] || [[ "${RAILWAY_DETECTED}" == "true" ]]; then
        log_debug "Skipping Docker check"
        return 0
    fi
    
    log_info "Checking Docker..."
    
    if ! command_exists docker; then
        log_warn "Docker not found. Install from https://docs.docker.com/get-docker/"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_warn "Docker daemon not running. Please start Docker."
        return 1
    fi
    
    log_success "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') detected"
    
    # Check Docker Compose
    if docker compose version >/dev/null 2>&1; then
        log_success "Docker Compose (plugin) detected"
    elif command_exists docker-compose; then
        log_success "Docker Compose (standalone) detected"
    else
        log_warn "Docker Compose not found"
        return 1
    fi
    
    return 0
}

check_postgres_client() {
    log_info "Checking PostgreSQL client tools..."
    
    if command_exists pg_isready; then
        log_success "PostgreSQL client tools detected"
        return 0
    else
        log_warn "pg_isready not found (optional)"
        return 1
    fi
}

################################################################################
# INSTALLATION FUNCTIONS
################################################################################

install_dependencies() {
    if [[ "${NO_INSTALL}" == "true" ]]; then
        log_info "Skipping dependency installation (--no-install)"
        return 0
    fi
    
    log_info "Installing dependencies with pnpm..."
    
    cd "${PROJECT_ROOT}"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would run: pnpm install"
        return 0
    fi
    
    if [[ "${VERBOSE}" == "true" ]]; then
        pnpm install
    else
        pnpm install --reporter=silent
    fi
    
    log_success "Dependencies installed"
}

################################################################################
# ENVIRONMENT CONFIGURATION
################################################################################

setup_env_files() {
    log_info "Setting up environment files..."
    
    local env_files=(
        "apps/web/.env:apps/web/.env.example"
        "apps/server/.env:apps/server/.env.example"
    )
    
    for env_pair in "${env_files[@]}"; do
        IFS=':' read -r env_file env_example <<< "${env_pair}"
        
        if [[ -f "${PROJECT_ROOT}/${env_file}" ]]; then
            log_debug "${env_file} already exists, skipping"
            continue
        fi
        
        if [[ ! -f "${PROJECT_ROOT}/${env_example}" ]]; then
            log_warn "${env_example} not found, skipping"
            continue
        fi
        
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_info "[DRY-RUN] Would create ${env_file} from ${env_example}"
            continue
        fi
        
        cp "${PROJECT_ROOT}/${env_example}" "${PROJECT_ROOT}/${env_file}"
        log_success "Created ${env_file}"
    done
}

configure_database_url() {
    if [[ "${RAILWAY_DETECTED}" == "true" ]]; then
        log_info "Railway detected - using Railway PostgreSQL"
        log_warn "Make sure to configure DATABASE_URL in Railway dashboard"
        return 0
    fi
    
    log_info "Configuring local database URL..."
    
    local db_url="postgresql://aviator:aviator@localhost:5432/aviator"
    
    # Update .env files
    for env_file in "apps/web/.env" "apps/server/.env"; do
        if [[ -f "${PROJECT_ROOT}/${env_file}" ]]; then
            if [[ "${DRY_RUN}" == "true" ]]; then
                log_info "[DRY-RUN] Would update DATABASE_URL in ${env_file}"
                continue
            fi
            
            # macOS vs Linux sed compatibility
            if [[ "$(uname)" == "Darwin" ]]; then
                sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"${db_url}\"|" "${PROJECT_ROOT}/${env_file}"
            else
                sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${db_url}\"|" "${PROJECT_ROOT}/${env_file}"
            fi
            
            log_debug "Updated DATABASE_URL in ${env_file}"
        fi
    done
    
    log_success "Database URL configured"
}

################################################################################
# DATABASE SETUP
################################################################################

setup_docker_postgres() {
    if [[ "${NO_DOCKER}" == "true" ]] || [[ "${RAILWAY_DETECTED}" == "true" ]]; then
        log_debug "Skipping Docker PostgreSQL setup"
        return 0
    fi
    
    if [[ "${DOCKER_COMPOSE_DETECTED}" != "true" ]]; then
        log_debug "No docker-compose.dev.yml found, skipping"
        return 0
    fi
    
    if ! check_docker; then
        log_warn "Docker not available, skipping PostgreSQL setup"
        return 1
    fi
    
    log_info "Setting up PostgreSQL with Docker..."
    
    if prompt_yes_no "Start PostgreSQL with Docker Compose?" "y"; then
        cd "${PROJECT_ROOT}"
        
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_info "[DRY-RUN] Would run: docker compose -f docker-compose.dev.yml up -d"
            return 0
        fi
        
        if docker compose version >/dev/null 2>&1; then
            docker compose -f docker-compose.dev.yml up -d
        else
            docker-compose -f docker-compose.dev.yml up -d
        fi
        
        log_success "PostgreSQL started"
        
        # Wait for PostgreSQL to be ready
        log_info "Waiting for PostgreSQL to be ready..."
        sleep 5
        
        if command_exists pg_isready; then
            local retries=0
            local max_retries=30
            
            while ! pg_isready -h localhost -p 5432 -U aviator >/dev/null 2>&1; do
                retries=$((retries + 1))
                if [[ ${retries} -ge ${max_retries} ]]; then
                    log_warn "PostgreSQL not ready after ${max_retries} seconds"
                    return 1
                fi
                sleep 1
            done
            
            log_success "PostgreSQL is ready"
        else
            log_warn "Cannot verify PostgreSQL status (pg_isready not available)"
        fi
    else
        log_info "Skipping PostgreSQL setup"
        return 1
    fi
}

setup_prisma() {
    log_info "Setting up Prisma..."
    
    cd "${PROJECT_ROOT}/apps/web"
    
    # Generate Prisma Client
    log_info "Generating Prisma Client..."
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would run: pnpm prisma generate"
    else
        if [[ "${VERBOSE}" == "true" ]]; then
            pnpm prisma generate
        else
            pnpm prisma generate >/dev/null 2>&1
        fi
        log_success "Prisma Client generated"
    fi
    
    # Database migration/push
    if prompt_yes_no "Initialize database schema?" "y"; then
        if [[ "${USE_MIGRATE}" == "true" ]]; then
            log_info "Running Prisma migrations..."
            if [[ "${DRY_RUN}" == "true" ]]; then
                log_info "[DRY-RUN] Would run: pnpm prisma migrate dev"
            else
                pnpm prisma migrate dev --name init
                log_success "Database migrated"
            fi
        else
            log_info "Pushing schema to database..."
            if [[ "${DRY_RUN}" == "true" ]]; then
                log_info "[DRY-RUN] Would run: pnpm prisma db push"
            else
                if [[ "${VERBOSE}" == "true" ]]; then
                    pnpm prisma db push
                else
                    pnpm prisma db push --accept-data-loss >/dev/null 2>&1
                fi
                log_success "Database schema pushed"
            fi
        fi
    else
        log_warn "Skipping database initialization"
    fi
    
    cd "${PROJECT_ROOT}"
}

################################################################################
# DISPLAY FUNCTIONS
################################################################################

show_help() {
    cat << EOF
Aviator Game - Setup Script

Usage: ./setup.sh [OPTIONS]

Options:
  --no-docker     Skip Docker PostgreSQL setup
  --no-install    Skip pnpm install
  --migrate       Use prisma migrate dev instead of db push
  --dry-run       Show commands without executing
  --verbose       Enable debug mode
  -h, --help      Show this help message

Examples:
  ./setup.sh                    # Full setup
  ./setup.sh --no-docker        # Skip Docker
  ./setup.sh --dry-run          # Preview actions
  ./setup.sh --verbose          # Debug mode

Requirements:
  - Node.js >= 18
  - pnpm (via Corepack)
  - Docker & Docker Compose (optional)
  - PostgreSQL client tools (optional)

EOF
}

show_next_steps() {
    printf "\n"
    printf "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}\n"
    printf "${GREEN}║                                                            ║${NC}\n"
    printf "${GREEN}║   ✅ Setup Complete!                                       ║${NC}\n"
    printf "${GREEN}║                                                            ║${NC}\n"
    printf "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}\n"
    printf "\n"
    
    log_info "Next steps:"
    printf "\n"
    
    printf "  ${CYAN}1. Start development servers:${NC}\n"
    printf "     ${YELLOW}pnpm dev${NC}\n"
    printf "\n"
    
    if [[ "${DOCKER_COMPOSE_DETECTED}" == "true" ]] && [[ "${NO_DOCKER}" != "true" ]]; then
        printf "  ${CYAN}2. Manage PostgreSQL:${NC}\n"
        printf "     ${YELLOW}make docker-up${NC}      # Start PostgreSQL\n"
        printf "     ${YELLOW}make docker-down${NC}    # Stop PostgreSQL\n"
        printf "     ${YELLOW}make docker-logs${NC}    # View logs\n"
        printf "\n"
    fi
    
    printf "  ${CYAN}3. Database management:${NC}\n"
    printf "     ${YELLOW}make db-studio${NC}       # Open Prisma Studio\n"
    printf "     ${YELLOW}make db-push${NC}         # Sync schema\n"
    printf "\n"
    
    printf "  ${CYAN}4. URLs:${NC}\n"
    printf "     Frontend:  ${BLUE}http://localhost:3000${NC}\n"
    printf "     Backend:   ${BLUE}http://localhost:3001${NC}\n"
    printf "     Health:    ${BLUE}http://localhost:3001/health${NC}\n"
    printf "\n"
    
    printf "  ${CYAN}5. Documentation:${NC}\n"
    printf "     ${YELLOW}cat START_HERE.md${NC}    # Quick start guide\n"
    printf "     ${YELLOW}cat COMMANDS.md${NC}      # All commands\n"
    printf "     ${YELLOW}make help${NC}            # Makefile commands\n"
    printf "\n"
    
    printf "${GREEN}Happy coding! 🚀${NC}\n"
    printf "\n"
}

################################################################################
# MAIN FUNCTION
################################################################################

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --no-docker)
                NO_DOCKER=true
                shift
                ;;
            --no-install)
                NO_INSTALL=true
                shift
                ;;
            --migrate)
                USE_MIGRATE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Header
    printf "\n"
    printf "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}\n"
    printf "${BLUE}║                                                            ║${NC}\n"
    printf "${BLUE}║   🎮 Aviator Game - Setup Script                          ║${NC}\n"
    printf "${BLUE}║      Congo Gaming                                          ║${NC}\n"
    printf "${BLUE}║                                                            ║${NC}\n"
    printf "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
    printf "\n"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warn "Running in DRY-RUN mode - no changes will be made"
    fi
    
    # Environment detection
    detect_environment
    
    # Dependency checks
    check_node
    check_pnpm
    check_docker || true
    check_postgres_client || true
    
    # Installation
    install_dependencies
    
    # Configuration
    setup_env_files
    configure_database_url
    
    # Database setup
    if setup_docker_postgres; then
        setup_prisma
    else
        log_warn "PostgreSQL not started. You'll need to configure it manually."
        log_warn "Then run: cd apps/web && pnpm prisma db push"
    fi
    
    # Show next steps
    show_next_steps
}

################################################################################
# SCRIPT ENTRY POINT
################################################################################

main "$@"
