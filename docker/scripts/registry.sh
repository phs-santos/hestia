#!/bin/bash

# ============================================================================
# Funções de Registry
# ============================================================================

# Função para fazer deploy para o registry
deploy_registry() {
    echo -e "${BLUE}🚀 Iniciando processo de deploy...${NC}"
    
    # Carregar env para REGISTRY e IMAGE_NAME
    if [ -f "$SCRIPT_DIR/../.env" ]; then
        source "$SCRIPT_DIR/../.env"
    fi

    if [ -z "$REGISTRY" ] || [ -z "$IMAGE_NAME" ]; then
        echo -e "${RED}❌ REGISTRY ou IMAGE_NAME não definido no .env!${NC}"
        return 1
    fi

    FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:latest"

    echo "Registry de Destino: $REGISTRY"
    echo "Imagem Local:       $IMAGE_NAME"
    echo "Imagem Remota:      $FULL_IMAGE"
    echo ""

    echo -e "${YELLOW}🏷️  Taggeando imagem...${NC}"
    docker tag "$IMAGE_NAME" "$FULL_IMAGE"

    echo -e "${BLUE}📤 Fazendo push para o registry...${NC}"
    if docker push "$FULL_IMAGE"; then
        echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    else
        echo -e "${RED}❌ Falha no deploy!${NC}"
    fi
    
    echo ""
    read -n 1 -s -r -p "Pressione qualquer tecla para continuar..."
    echo ""
}

# Função para baixar do registry
pull_from_registry() {
    echo -e "${BLUE}⬇️  Baixando imagem do Registry...${NC}"
    
    if [ -f "$SCRIPT_DIR/../.env" ]; then
        source "$SCRIPT_DIR/../.env"
    fi

    if [ -z "$REGISTRY" ] || [ -z "$IMAGE_NAME" ]; then
        echo -e "${RED}❌ REGISTRY ou IMAGE_NAME não definido no .env!${NC}"
        return 1
    fi

    FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:latest"

    if docker pull "$FULL_IMAGE"; then
        echo -e "${GREEN}✅ Imagem baixada com sucesso!${NC}"
        
        echo -e "${BLUE}🏷️  Atualizando tag local...${NC}"
        docker tag "$FULL_IMAGE" "$IMAGE_NAME"
        
        read -p "Deseja reiniciar o container com a nova imagem? (S/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Ss]$ || -z $REPLY ]]; then
            restart_container
        fi
    else
        echo -e "${RED}❌ Falha ao baixar a imagem.${NC}"
    fi
}

# Função para iniciar diretamente do registry
start_from_registry() {
    echo -e "${BLUE}⬇️  Baixando e Iniciando do Registry...${NC}"
    
    if [ -f "$SCRIPT_DIR/../.env" ]; then
        source "$SCRIPT_DIR/../.env"
    fi

    if [ -z "$REGISTRY" ] || [ -z "$IMAGE_NAME" ]; then
        echo -e "${RED}❌ REGISTRY ou IMAGE_NAME não definido no .env!${NC}"
        return 1
    fi

    FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:latest"

    if docker pull "$FULL_IMAGE"; then
        docker tag "$FULL_IMAGE" "$IMAGE_NAME"
        echo -e "${GREEN}🚀 Iniciando container...${NC}"
        docker compose up -d --no-build
        echo -e "${GREEN}✅ Container iniciado com a imagem do registry!${NC}"
    else
        echo -e "${RED}❌ Falha ao baixar a imagem.${NC}"
    fi
}
