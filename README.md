# API REST - NestJS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">API REST construída com NestJS para servir aplicações front-end de forma eficiente e escalável.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/database-Prisma-2D3748?logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/auth-JWT-000000?logo=jsonwebtokens" alt="JWT Auth" />
</p>

## Descrição

Esta API REST foi desenvolvida utilizando o framework NestJS e oferece uma solução robusta para aplicações web modernas. A aplicação conta com autenticação baseada em níveis de usuário, integração com banco de dados através do Prisma ORM e uma arquitetura bem estruturada seguindo os princípios do NestJS.

## Principais Características

- **🏗️ Arquitetura Modular**: Estruturada seguindo os padrões do NestJS
- **🔐 Sistema de Autenticação**: Guards de rotas com controle por nível de usuário
- **💾 Prisma ORM**: Integração robusta com banco de dados
- **🛡️ Segurança**: Implementação de middlewares de segurança
- **📊 Validação de Dados**: Validação automática de requests e responses
- **🚀 Performance**: Otimizada para alta performance e escalabilidade

## Tecnologias Utilizadas

- **NestJS** - Framework Node.js progressivo
- **Prisma ORM** - Toolkit de banco de dados de próxima geração
- **TypeScript** - Linguagem principal do projeto
- **JWT** - Autenticação baseada em tokens
- **Passport** - Middleware de autenticação

## Configuração do Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Banco de dados (PostgreSQL, MySQL, SQLite, etc.)

### Instalação

```bash
# Clone o repositório
$ git clone <url-do-repositorio>

# Acesse o diretório do projeto
$ cd nome-do-projeto

# Instale as dependências
$ npm install
```

### Configuração do Ambiente

```bash
# Copie o arquivo de exemplo das variáveis de ambiente
$ cp .env.example .env

# Configure as variáveis de ambiente no arquivo .env
# DATABASE_URL="sua-string-de-conexao-do-banco"
# JWT_SECRET="seu-jwt-secret"
# PORT=3000
```

### Configuração do Banco de Dados

```bash
# Execute as migrações do Prisma
$ npx prisma migrate dev

# Gere o cliente Prisma
$ npx prisma generate

# (Opcional) Popule o banco com dados iniciais
$ npx prisma db seed
```

## Executando a Aplicação

```bash
# Modo desenvolvimento
$ npm run start:dev

# Modo produção
$ npm run start:prod

# Modo watch (desenvolvimento com reload automático)
$ npm run start:watch
```

A API estará disponível em `http://localhost:3000` (ou na porta configurada).

## Executando os Testes

```bash
# Testes unitários
$ npm run test

# Testes e2e
$ npm run test:e2e

# Cobertura de testes
$ npm run test:cov
```

## Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
├── guards/              # Guards de proteção de rotas
├── modules/             # Módulos da aplicação
├── prisma/              # Configurações do Prisma
├── common/              # Utilities e helpers compartilhados
├── decorators/          # Decorators customizados
└── main.ts              # Arquivo principal da aplicação
```

## Sistema de Autenticação

A API implementa um sistema robusto de autenticação com diferentes níveis de acesso:

- **Admin**: Acesso total ao sistema
- **Moderador**: Acesso limitado a funcionalidades específicas
- **Usuário**: Acesso básico às funcionalidades

### Endpoints de Autenticação

```bash
POST /auth/login          # Login do usuário
POST /auth/register       # Registro de novo usuário
POST /auth/refresh        # Renovação do token
GET  /auth/profile        # Perfil do usuário autenticado
```

## Documentação da API

A documentação completa da API pode ser acessada através do Swagger UI em:

```
http://localhost:3000/api/docs
```

## Banco de Dados

O projeto utiliza o Prisma ORM para gerenciamento do banco de dados, oferecendo:

- Type-safety completo
- Migrações automáticas
- Query builder intuitivo
- Suporte a múltiplos bancos de dados

### Comandos Úteis do Prisma

```bash
# Visualizar o banco de dados
$ npx prisma studio

# Reset do banco de dados
$ npx prisma migrate reset

# Aplicar mudanças no schema
$ npx prisma db push
```

## Deploy

Para deploy em produção, recomenda-se:

1. Configurar as variáveis de ambiente adequadas
2. Executar as migrações do banco
3. Construir a aplicação: `npm run build`
4. Iniciar em modo produção: `npm run start:prod`

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor:

- Abra uma [issue](../../issues) no GitHub
- Entre em contato através do email: seu-email@exemplo.com

## Autor

- **Seu Nome** - [Seu GitHub](https://github.com/Rafael01Gx)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
