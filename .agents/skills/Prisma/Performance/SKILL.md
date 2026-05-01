---
name: prisma-performance
description: >
  Performance com Prisma: Otimização de Queries (N+1), Logging de Queries, Accelerate e Pulse.
  Use para diagnosticar lentidões e otimizar o acesso ao banco de dados.
---

# Prisma — Performance & Optimization

## 1. Evitando N+1

### ❌ Ruim (Loop com query)
```typescript
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
}
```

### ✅ Bom (Include/Select)
```typescript
const posts = await prisma.post.findMany({
  include: { author: { select: { id: true, name: true } } },
});
```

---

## 2. Logging de Queries Lentais

```typescript
this.$on('query', (e) => {
  if (e.duration > 200) {
    this.logger.warn(`Query lenta (${e.duration}ms): ${e.query}`);
  }
});
```

---

## 3. Prisma Accelerate (Global Cache)

```typescript
const prisma = new PrismaClient().$extends(withAccelerate());
const users = await prisma.user.findMany({
  cacheStrategy: { ttl: 60, swr: 300 },
});
```

---

## 4. Connection Pool

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20"
```
