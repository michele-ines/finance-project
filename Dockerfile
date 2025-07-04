# ================================
# Dockerfile Unificado - Next.js
# Suporta desenvolvimento e produção
# ================================

# Base image
FROM node:22-alpine AS base
WORKDIR /app

# Instalar dependências do sistema (Alpine)
RUN apk add --no-cache libc6-compat

# Copiar arquivos de dependências
COPY package*.json ./

# ================================
# Stage 1: Instalar dependências
# ================================
FROM base AS deps
RUN npm ci

# ================================
# Stage 2: Build da aplicação
# ================================
FROM base AS builder

# Copiar dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Fazer build da aplicação
RUN npm run build

# ================================
# Stage 3: Desenvolvimento
# ================================
FROM base AS development

# Copiar dependências (incluindo devDependencies)
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]

# ================================
# Stage 4: Produção (padrão)
# ================================
FROM base AS production

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar build da aplicação
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copiar arquivos de configuração
COPY package*.json ./

# Expor porta
EXPOSE 3000

# Comando para produção
CMD ["npm", "run", "start"]
