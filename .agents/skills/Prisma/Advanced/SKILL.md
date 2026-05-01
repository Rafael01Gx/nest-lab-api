---
name: prisma-advanced
description: >
  Recursos Avançados do Prisma: Soft Delete, Transactions, Extensions, Middleware e Raw Queries.
  Use para lógica de negócio complexa, integridade de dados e extensões do client.
---

# Prisma — Advanced Features

## 1. Soft Delete (Prisma Extension)

```typescript
export const softDeleteExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      user: {
        async delete(args) {
          return client.user.update({ ...args, data: { deletedAt: new Date() } });
        },
      },
    },
  });
});
```

---

## 2. Transactions

### Interativa (Sequencial)

```typescript
await this.prisma.$transaction(async (tx) => {
  await tx.user.update({ where: { id: fromId }, data: { credits: { decrement: amount } } });
  await tx.user.update({ where: { id: toId }, data: { credits: { increment: amount } } });
});
```

### Em Lote (Performance)

```typescript
const [user, log] = await this.prisma.$transaction([
  this.prisma.user.create({ data: dto }),
  this.prisma.auditLog.create({ data: { action: 'CREATED' } }),
]);
```

---

## 3. Prisma Client Extensions (v5+)

```typescript
export const resultExtension = Prisma.defineExtension({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) { return `${user.firstName} ${user.lastName}`; },
      },
    },
  },
});
```

---

## 4. Middleware (Antigo, mas útil)

```typescript
this.$use(async (params, next) => {
  const result = await next(params);
  // lógica pós-operação...
  return result;
});
```
