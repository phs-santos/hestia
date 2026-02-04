#!/bin/bash

# ============================================================================
# Funções de UI / Menu
# ============================================================================

show_menu() {
    clear
    echo "=================================================="
    echo "   Gerenciador Docker - $CONTAINER_NAME"
    echo "=================================================="
    echo ""
    
    echo -e "${BLUE}--- CICLO DE VIDA ---${NC}"
    echo "1) Build da imagem"
    echo "2) Iniciar container (Up)"
    echo "3) Parar container (Down)"
    echo "4) Reiniciar container"
    echo "5) Ver logs"
    echo "8) Status dos containers"
    echo ""

    echo -e "${BLUE}--- MANUTENÇÃO ---${NC}"
    echo "6) Build Completo (no-cache) + Start"
    echo "7) Limpar tudo (destrutivo)"
    echo ""

    echo -e "${BLUE}--- REGISTRY ---${NC}"
    echo "9) Deploy para o Registry (Push)"
    echo "10) Baixar do Registry (Pull)"
    echo "11) Iniciar do Registry (Pull + Up)"
    echo ""

    echo -e "${BLUE}--- SISTEMA ---${NC}"
    echo "C) Limpar terminal"
    echo "H) Ajuda / Documentação"
    echo "0) Sair"
    echo ""
}
