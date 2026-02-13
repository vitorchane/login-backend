# Login Backend

## Descrição

Este repositório contém uma API em NestJS para cadastro e autenticação de usuários. O objetivo é permitir registro de usuários (com validação de documento), login via JWT e consultas protegidas.

## Ferramentas necessárias

- Docker
- Docker-Compose
- Git

## Setup

1. Clonar e instalar
   - git clone <seu-repo>
   - cd login-backend
   - npm install

2. Configurar variáveis de ambiente
   - Crie o arquivo .env`
   - Edite `.env`
     - NODE_ENV=development
     - PORT=3000
     - POSTGRES_USER=postgres
     - POSTGRES_PASSWORD=123456
     - POSTGRES_DB=login_db
     - DATABASE_URL="postgresql://postgres:123456@postgres_nest:5432/login_db?schema=public"

3. Criar Banco e aplicar migrations:
   - npx prisma migrate dev --name init

4. Rodar projeto em desenvolvimento
   - npm run start:dev

5. Rodando com Docker

- Subir serviços:
  - docker compose up
- Parar e remover:
  - docker compose down
- Aplicar migrations dentro do container
  - docker compose exec api npx prisma migrate deploy
- Remover volumes e imagens:
  - docker compose down -v --rmi all && docker system prune -f

## Endpoints

- POST /user
  - Cria usuário
  - Body: { email, password, country, document }
  - Validações: email, senha >=6, country ISO, document (CPF para BR, genérico 3–50 chars para outros)
  - Resposta: 201 com dados do usuário (sem senha)

- POST /auth/login
  - Autentica usuário
  - Body: { email, password }
  - Retorna: accessToken (JWT) + dados básicos do usuário

- GET /user
  - Lista usuários (protegido)
  - Header: Authorization: Bearer <token>

- GET /user/:id
  - Busca usuário por id (protegido)
  - Header: Authorization: Bearer <token>

## Documentação interativa

- Swagger UI: http://localhost:3000/api/docs
  - Permite testar rotas, ver DTOs e adicionar o token Bearer para chamadas protegidas.

## Principais tecnologias e libs

- Framework: NestJS 11
- Linguagem: TypeScript
- ORM: Prisma
- Banco: PostgreSQL
- Autenticação: JWT (nestjs/jwt + passport-jwt)
- Hash de senhas: bcrypt
- Validação: class-validator + validadores customizados (CPF, país, documento)
- Documentação: @nestjs/swagger + swagger-ui
- Testes: Jest
- Container: Docker + docker-compose

## Principais arquivos / pastas

- src/modules/user — controladores, serviços, DTOs
- src/modules/authentication — login, strategy JWT
- src/common/validators — cpf, country, document, document-by-country
- prisma/schema.prisma — modelo de dados e migrations
- Dockerfile, docker-compose.yml, .env.example
- QUICKSTART.md, README-DETAILED.md, TESTES.md (exemplos de uso)

## Segurança & comportamentos importantes

- Senhas: hasheadas com bcrypt (salt rounds configurados)
- JWT: expiração configurada (24h por padrão); secret via .env
- CPF: validação com checksum e rejeição de sequências repetidas
- Documentos estrangeiros: validação genérica (3–50 caracteres)
- Emails duplicados retornam 409 Conflict
- Validação global ativada (ValidationPipe) — campos extras são rejeitados

## Notas finais

- Mais coisas poderiam ser implementadas como efresh tokens, roles, rate-limiting, observability etc, porém como é apenas um teste tecnico, foi dado foco maior para as funcionalidades realmente necessárias.
- Com certeza em um projeto para produção não seria feito uma API de autentitcação, dando foque maior a projetos open-source que entregam soluções prontas e confiáveis como Logto, Keycloak etc
