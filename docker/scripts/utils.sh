#!/bin/bash

# ============================================================================
# Funções Utilitárias
# ============================================================================

# Função para limpar todos os recursos docker
clean_all() {
    echo -e "${RED}⚠️  AVISO: Isso irá remover todos os containers, imagens e volumes associados a este projeto.${NC}"
    read -p "Tem certeza? (s/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}🧹 Limpando...${NC}"
        docker compose down --rmi all --volumes --remove-orphans
        echo -e "${GREEN}✅ Recursos do projeto limpos!${NC}"
    else
        echo -e "${BLUE}Operação cancelada.${NC}"
    fi
    sleep 2
}

# Função para mostrar informações de ajuda
show_helper() {
    clear
    echo "=================================================="
    echo "   Ajuda do Gerenciador Docker"
    echo "=================================================="
    echo ""
    echo -e "${YELLOW}Opções de Ciclo de Vida:${NC}"
    echo "1) Build da imagem: Compila uma nova imagem Docker baseada no código atual."
    echo "2) Iniciar container: Inicia os containers definidos no docker-compose.yml."
    echo "3) Parar container: Para e remove os containers."
    echo "4) Reiniciar container: Reinicia os containers. Útil para recarregar configs."
    echo "5) Ver logs: Mostra a saída dos containers em tempo real. Ctrl+C para sair."
    echo "8) Status dos containers: Mostra quais containers estão rodando."
    echo ""
    echo -e "${YELLOW}Opções de Manutenção:${NC}"
    echo "6) Build completo (no-cache) + Start: Força a reconstrução sem cache e inicia."
    echo "7) Limpar tudo: Remove containers, imagens e volumes. Use com cuidado."
    echo ""
    echo -e "${YELLOW}Opções de Registry:${NC}"
    echo "9) Deploy para Registry: Taggeia e faz push da imagem para o registry remoto."
    echo "10) Baixar do Registry: Baixa a última imagem do registry."
    echo "11) Iniciar do Registry: Baixa e inicia sem necessidade de build local."
    echo ""
    read -n 1 -s -r -p "Pressione qualquer tecla para voltar ao menu..."
    echo ""
}
