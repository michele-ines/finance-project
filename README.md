# 💰 Financial Project

> Projeto de aplicação financeira desenvolvido com Next.js, React e tecnologias modernas.

Este é um projeto de aplicação financeira bootstrapped com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📚 Índice

- [🚀 Como iniciar o projeto](#-como-iniciar-o-projeto)
- [📌 Pré-requisitos](#-pré-requisitos)
- [🛠️ Tecnologias](#️-tecnologias)
- [⚙️ Scripts Disponíveis](#️-scripts-disponíveis)
- [🐳 Docker](#-docker)
- [🔧 Git Hooks (Husky)](#-git-hooks-husky)
- [🗄️ Configuração do MongoDB](#️-configuração-do-mongodb)
- [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
- [🤝 Contribuição](#-contribuição)
- [📖 Learn More](#-learn-more)
- [📄 Licença](#-licença)

## 🛠️ Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React para renderização e roteamento (App Router)
- **[React 19](https://react.dev/)** - Biblioteca para construção de interfaces
- **[Material-UI](https://mui.com/)** - Componentes visuais e design responsivo
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Storybook](https://storybook.js.org/)** - Desenvolvimento isolado de componentes
- **[Jest](https://jestjs.io/)** & **[React Testing Library](https://testing-library.com/)** - Testes unitários
- **[ESLint](https://eslint.org/)** - Análise estática e padronização do código
- **[Husky](https://typicode.github.io/husky/)** - Git Hooks automáticos
- **[MongoDB](https://www.mongodb.com/)** & **[Mongoose](https://mongoosejs.com/)** - Banco de dados
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - Gerenciamento de estado

## 📌 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** (versão 18 LTS ou superior)
- **[npm](https://www.npmjs.com/)** ou **[yarn](https://yarnpkg.com/)**
- **[Git](https://git-scm.com/)**
- **[MongoDB](https://www.mongodb.com/)** (local ou MongoDB Atlas)
- **[Docker](https://docs.docker.com/get-docker/)** (opcional, para containerização)

## 🚀 Como iniciar o projeto

### 1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd financial-project
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto:
```bash
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### 5. Acesse a aplicação:
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## ⚙️ Scripts Disponíveis

### 🔧 Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run storybook    # Inicia Storybook na porta 6006
```

### 🏗️ Build e Produção
```bash
npm run build        # Cria build otimizado para produção
npm run start        # Inicia servidor em modo produção
```

### 🧪 Testes e Qualidade
```bash
npm run test         # Executa testes com Jest
npm run lint         # Executa ESLint
npm run typecheck    # Verifica tipos TypeScript
```

### 📚 Storybook
```bash
npm run storybook       # Inicia Storybook
npm run build-storybook # Build do Storybook
```

## 🐳 Docker

Este projeto suporta Docker para desenvolvimento e produção através de um Dockerfile unificado com multi-stage build.

### 📋 Pré-requisitos Docker
- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (opcional)

### 🔧 Desenvolvimento com Docker

#### 1. Construir imagem de desenvolvimento:
```bash
docker build --target development -t finance-app:dev .
```

#### 2. Executar container de desenvolvimento:
```bash
# Com hot-reload (recomendado)
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules finance-app:dev

# Sem volume mount
docker run -p 3000:3000 finance-app:dev
```

### 🚀 Produção com Docker

#### 1. Construir imagem de produção:
```bash
docker build -t finance-app:prod .
```

#### 2. Executar container de produção:
```bash
docker run -p 3000:3000 finance-app:prod
```

### ⚡ Comandos Rápidos Docker
```bash
# Desenvolvimento - Build e Run
docker build --target development -t finance-app:dev . && docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules finance-app:dev

# Produção - Build e Run
docker build -t finance-app:prod . && docker run -p 3000:3000 finance-app:prod

# Parar containers
docker stop $(docker ps -q --filter ancestor=finance-app:dev)
docker stop $(docker ps -q --filter ancestor=finance-app:prod)

# Remover imagens
docker rmi finance-app:dev finance-app:prod
```

### 🔍 Variáveis de Ambiente Docker
```bash
# Executar com arquivo .env
docker run -p 3000:3000 --env-file .env finance-app:dev
```

### 🐛 Troubleshooting Docker

**Porta 3000 em uso:**
```bash
lsof -i :3000                    # Verificar processo
kill -9 <PID>                    # Parar processo
docker run -p 3001:3000 app:dev  # Usar outra porta
```

**Problemas de módulos:**
```bash
docker build --no-cache --target development -t finance-app:dev .
```

**Hot-reload não funciona:**
```bash
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules finance-app:dev
```

## 🔧 Git Hooks (Husky)

Este projeto usa Husky para automação de Git Hooks.

### Configuração Automática
O script `prepare` já está configurado no `package.json`:
```bash
npm install  # Instala e configura Husky automaticamente
```

### Hooks Disponíveis
- **post-merge**: Executa `npm install` após `git pull`
- **post-checkout**: Executa `npm install` ao trocar de branch

### Configuração Manual (se necessário)
```bash
# Instalar Husky
npm install --save-dev husky

# Inicializar
npm run prepare

# Criar hooks
npx husky add .husky/post-merge "npm install"
npx husky add .husky/post-checkout "npm install"
```

## 🗄️ Configuração do MongoDB

### Pré-requisitos
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ou MongoDB local
- String de conexão do banco

### Configuração
1. Crie arquivo `.env.local`:
```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

2. A conexão é gerenciada pelo Mongoose em `src/libs/mongoDB.js`

## 🏗️ Arquitetura do Projeto

### Padrão Arquitetural
- **Modular Architecture** / **Feature-Based Architecture**
- **Domain-driven structure (DDD-light)**
- **Layered responsibilities**

### Estrutura de Pastas
```
src/
├── app/                 # App Router (Next.js 13+)
│   ├── (auth)/         # Grupo de rotas de autenticação
│   ├── (pages)/        # Grupo de páginas principais
│   └── api/            # API Routes
├── components/         # Componentes reutilizáveis
│   ├── ui/            # Componentes base
│   ├── forms/         # Formulários
│   └── widgets/       # Widgets específicos
├── shared/            # Componentes compartilhados
├── store/             # Redux store e slices
├── hooks/             # Custom hooks
├── utils/             # Utilitários
├── interfaces/        # Tipos TypeScript
└── styles/           # Estilos globais
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o repositório
2. **Crie** uma branch: `git checkout -b feature/nova-feature`
3. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova feature'`
4. **Push** para a branch: `git push origin feature/nova-feature`
5. **Abra** um Pull Request

### Padrões de Commit
Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de build/config

## 📖 Learn More

Para aprender mais sobre as tecnologias utilizadas:

- **[Next.js Documentation](https://nextjs.org/docs)** - Features e API do Next.js
- **[Learn Next.js](https://nextjs.org/learn)** - Tutorial interativo
- **[React Documentation](https://react.dev/)** - Documentação oficial do React
- **[Material-UI](https://mui.com/getting-started/)** - Guia de componentes
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Guia TypeScript

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<div align="center">
  <p>Desenvolvido com ❤️ para FIAP</p>
  <p>
    <a href="#-financial-project">⬆️ Voltar ao topo</a>
  </p>
</div>
