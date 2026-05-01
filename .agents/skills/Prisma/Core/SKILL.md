---
name: prisma-core
description: >
  Fundamentos do Prisma ORM: Instalação, Schema Design, PrismaService, PrismaModule e Migrations.
  Use para configurar o banco de dados e gerenciar o esquema.
---

# Prisma — Core Foundations

## 1. Instalação & Configuração Inicial

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init --datasource-provider postgresql
```

### Variáveis de ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

---

## 2. Schema Design — Convenções e Padrões

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@map("users")
}

enum Role {
  USER
  ADMIN
  @@map("role")
}
```

---

## 3. PrismaService — Implementação Robusta

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

---

## 4. Migrations — Workflow Profissional

```bash
# Desenvolvimento
npx prisma migrate dev --name add_user_avatar

# Produção
npx prisma migrate deploy
```
