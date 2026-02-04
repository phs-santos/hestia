# Etapa 1: Build do React Client
FROM node:20-alpine AS client-build
WORKDIR /app/client

# Instala dependências usando npm ci para builds mais rápidos e reproduzíveis
COPY client/package*.json ./
RUN npm ci

# Copia fonte e compila
COPY client/ .
RUN npm run build

# Etapa 2: Build do Node Server
FROM node:20-alpine AS server-build
WORKDIR /app/server

# Instala dependências
COPY server/package*.json ./
RUN npm ci

# Copia fonte e compila
COPY server/ .
RUN npm run build

# Etapa 3: Imagem de produção
FROM node:20-alpine
LABEL maintainer="Hestia Team"

# Instala tini para melhor gerenciamento de sinais
RUN apk add --no-cache tini

WORKDIR /app

# Garante que usamos o ambiente de produção
ENV NODE_ENV=production
ENV PORT=3000

# Instala dependências apenas para o servidor
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production && npm cache clean --force

# Copia os arquivos buildados
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=client-build /app/client/dist ./client/dist

# Segurança: Executa como usuário não-root
RUN chown -R node:node /app
USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

EXPOSE ${PORT}

ENTRYPOINT ["/sbin/tini", "--"]

# Inicia o servidor a partir do diretório /app para manter a resolução de caminhos consistente
CMD ["node", "server/dist/index.js"]
