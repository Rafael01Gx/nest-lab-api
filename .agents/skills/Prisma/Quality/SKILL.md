---
name: prisma-quality
description: >
  Qualidade com Prisma: Testes (Mock/Real), Seed, Multi-Tenancy, Segurança e Checklist.
  Use para garantir a integridade, segurança e isolamento dos dados.
---

# Prisma — Quality & Best Practices

## 1. Testes

### Mock (Unit)
```typescript
prisma.user.findUnique.mockResolvedValue(mockUser);
```

### Banco Real (Integration)
```typescript
beforeEach(() => db.reset());
it('deve criar usuário', async () => { ... });
```

---

## 2. Seed Idempotente

```typescript
async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { email: 'admin@test.com', name: 'Admin' },
  });
}
```

---

## 3. Segurança

- [ ] Use `select` explícito para evitar vazamento de dados (ex: password)
- [ ] Nunca use `$queryRawUnsafe` com interpolação de string
- [ ] Valide `DATABASE_URL` no boot da aplicação

---

## 4. Multi-Tenancy

```typescript
// Extrair tenant do header e filtrar automaticamente via Middleware ou Extension
params.args.where = { ...params.args.where, tenantId: this.tenantId };
```

---

## 5. Checklist de Qualidade

- [ ] Models com `createdAt`, `updatedAt` e `deletedAt`
- [ ] Índices explícitos em todas as chaves estrangeiras (FKs)
- [ ] Soft delete implementado e testado
- [ ] Transações usadas para operações multi-tabela
- [ ] Paginação obrigatória em todas as listagens
