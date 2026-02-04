#!/bin/bash

# ============================================================================
# Gerenciador de Build e Ciclo de Vida Docker
# ============================================================================
# Este script automatiza as tarefas relacionadas ao Docker para o projeto.
# Ele carrega scripts modularizados do diretório 'scripts'.

set -e  # Sair em caso de erro

# Cores para saída
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export NC='\033[0m'

# Diretório do script
export SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Carregar configuração do .env
if [ -f "../.env" ]; then
    set -a
    source "../.env"
    set +a
else
    echo -e "${YELLOW}⚠️  Aviso: Arquivo .env não encontrado no diretório pai.${NC}"
fi

# Metadados do projeto (podem ser sobrescritos no .env)
export CONTAINER_NAME="${CONTAINER_NAME:-Hestia}"
export IMAGE_NAME="${IMAGE_NAME:-hestia-app}"
export PORT="${VITE_API_SERVER_PORT:-3000}"

# Verificação de pré-requisitos
check_requirements() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Erro: Docker não está instalado!${NC}"
        exit 1
    fi

    if ! command -v docker compose &> /dev/null; then
        echo -e "${RED}❌ Erro: Docker Compose não está instalado!${NC}"
        exit 1
    fi
}

# Carregar todos os scripts modulares
source_scripts() {
    local script_list=("core.sh" "registry.sh" "utils.sh" "menu.sh")
    for script in "${script_list[@]}"; do
        if [ -f "scripts/$script" ]; then
            source "scripts/$script"
        else
            echo -e "${RED}❌ Erro: Script obrigatório 'scripts/$script' não encontrado!${NC}"
            exit 1
        fi
    done
}

# Execução Principal
main() {
    check_requirements
    source_scripts

    while true; do
        show_menu
        read -p "Selecione uma opção: " choice
        
        case $choice in
            1) build_image ;;
            2) start_container ;;
            3) stop_container ;;
            4) restart_container ;;
            5) show_logs ;;
            6) 
                build_image_no_cache
                start_container
                ;;
            7) clean_all ;;
            8) show_status ;;
            9) deploy_registry ;;
            10) pull_from_registry ;;
            11) start_from_registry ;;
            c|C) clear ;;
            h|H) show_helper ;;
            0)
                echo -e "${GREEN}👋 Até logo!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opção inválida!${NC}"
                sleep 0.5
                ;;
        esac
    done
}

main "$@"
