This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Financial Project

Projeto de aplicação financeira utilizando as seguintes tecnologias:

- **Next.js** para renderização e roteamento.
- **React** como biblioteca de construção de interfaces.
- **Material-UI** para componentes visuais e design responsivo.
- **Storybook** para desenvolvimento isolado e documentação de componentes.
- **Figma** para design e prototipação.
- **ESLint** para análise estática e padronização do código.
- **Jest** para testes unitários e de integração.

# Financial Project

Este é um projeto de aplicação financeira desenvolvido com as seguintes tecnologias:

- **Next.js** para renderização e roteamento.
- **React** como biblioteca para construção de interfaces.
- **Material-UI** para componentes visuais e design responsivo.
- **Storybook** para desenvolvimento isolado e documentação de componentes.
- **Figma** para design e prototipação.
- **ESLint** para análise estática e padronização do código.
- **Jest** para testes unitários e de integração.

## 📌 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- Um gerenciador de pacotes como `npm` ou `yarn`.

## 🚀 Como iniciar o projeto

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd financial-project

2. Instale as dependências:
    npm install


## Estrutura do Projeto

Uma estrutura básica do projeto pode ser organizada da seguinte forma:



## Scripts Disponíveis

No arquivo `package.json`, os seguintes scripts estão configurados:


### Desenvolvimento
- **npm run dev**  
  Inicia o servidor de desenvolvimento com Next.js.


### Build e Produção
- **npm run build**  
  Cria uma versão otimizada da aplicação para produção.
- **npm run start**  
  Inicia o servidor Next.js em modo produção.


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


### Linting
- **npm run lint**  
  Executa o lint em todo o projeto, verificando a qualidade do código utilizando ESLint.
- **npm run lint:fix**  
  Tenta corrigir automaticamente os problemas encontrados.  
  _Exemplo:_ `npm run lint -- --file pages/index.js`


### Testes
- **npm run test**  
  Executa a suíte de testes utilizando Jest.
- **npm run test:watch**  
  Roda os testes em modo watch, útil para desenvolvimento e execução contínua enquanto você salva os arquivos.
- **npm run test:pattern**  
  Executa testes que correspondem a um padrão específico.  
  _Exemplo:_ `npm run test:pattern -- Button`


### Desenvolvimento com Storybook
O Storybook permite o desenvolvimento isolado dos componentes. Para iniciar o Storybook, adicione o script correspondente no `package.json` (caso ainda não esteja configurado) e execute:
- **npm run storybook**

> **Observação:** Verifique a configuração do Storybook no diretório `.storybook` para personalizações ou atualizações.


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Contribuição

Contribuições são bem-vindas! Caso deseje contribuir com melhorias ou novas funcionalidades:

1. Faça um fork do repositório.
2. Crie uma branch com sua feature:  
   `git checkout -b minha-feature`
3. Commit suas alterações:  
   `git commit -m 'Adicionar nova feature'`
4. Envie a branch para o repositório remoto:  
   `git push origin minha-feature`
5. Abra um Pull Request.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).