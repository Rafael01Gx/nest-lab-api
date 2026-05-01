---
name: prisma-repository
description: >
  Padrão Repository com Prisma: CRUD, Paginação, Tratamento de Erros e Type-safety.
  Use para abstrair o acesso aos dados e padronizar as respostas.
---

# Prisma — Repository Pattern

## 1. Repository Concreto — Exemplo

```typescript
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id, deletedAt: null } });
  }

  async findAll(params: PaginationDto) {
    const { page = 1, limit = 20 } = params;
    return this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { deletedAt: null },
    });
  }
}
```

---

## 2. Paginação Reutilizável

```typescript
export interface PaginatedResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
```

---

## 3. Tratamento de Erros

```typescript
export function handlePrismaError(error: unknown, entity = 'Registro'): never {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') throw new ConflictException(`${entity} já existe`);
    if (error.code === 'P2025') throw new NotFoundException(`${entity} não encontrado`);
  }
  throw error;
}
```

---

## 4. Códigos de Erro Frequentes

| Código | Situação | Tratamento |
|--------|----------|------------|
| `P2002` | Unique constraint | `ConflictException` |
| `P2025` | Not found | `NotFoundException` |
| `P2003` | FK violation | `ConflictException` |
