#!/bin/bash

# ============================================================================
# Funções de Ciclo de Vida (Core)
# ============================================================================

# Função para buildar imagem
build_image() {
    echo -e "${GREEN}🔨 Building imagem docker...${NC}"
    docker compose build
    echo -e "${YELLOW}🧹 Removendo imagens antigas (dangling)...${NC}"
    docker image prune -f || true
    echo -e "${GREEN}✅ Build concluído!${NC}"
}

# Função para buildar imagem sem cache
build_image_no_cache() {
    echo -e "${GREEN}🔨 Buildando imagem docker (sem cache)...${NC}"
    docker compose build --no-cache
    echo -e "${YELLOW}🧹 Removendo imagens antigas...${NC}"
    docker image prune -f || true
    echo -e "${GREEN}✅ Build concluído!${NC}"
}

# Função para iniciar container
start_container() {
    echo -e "${GREEN}🚀 Iniciando container...${NC}"
    docker compose up -d
    echo -e "${GREEN}✅ Container iniciado!${NC}"
    echo ""
    if [ -n "$VITE_API_SERVER_PORT" ]; then
        echo "Aplicação disponível em: http://localhost:$VITE_API_SERVER_PORT"
    fi
}

# Função para parar container
stop_container() {
    echo -e "${YELLOW}🛑 Parando container...${NC}"
    docker compose down
    echo -e "${GREEN}✅ Container parado!${NC}"
}

# Função para reiniciar container
restart_container() {
    echo -e "${YELLOW}🔄 Reiniciando container...${NC}"
    docker compose restart
    echo -e "${GREEN}✅ Container reiniciado!${NC}"
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Mostrando logs (Ctrl+C para sair)...${NC}"
    docker compose logs -f
}

# Função para mostrar status
show_status() {
    echo -e "${BLUE}📊 Status dos Containers:${NC}"
    docker compose ps
    echo ""
    read -n 1 -s -r -p "Pressione qualquer tecla para continuar..."
    echo ""
}
