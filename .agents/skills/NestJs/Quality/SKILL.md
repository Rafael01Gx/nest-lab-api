---
name: nestjs-quality
description: >
  Qualidade e Melhores Práticas no NestJS: Testes (Jest/E2E), Logging Estruturado (Pino), Estrutura de Pastas, Geração de Recursos e Checklist.
  Use para garantir a manutenibilidade e confiabilidade do código.
---

# NestJS — Quality & Best Practices

## 1. Testes

### Unit Test de Service

```typescript
describe('UsersService', () => {
  it('deve retornar um usuário por id', async () => {
    repo.findOne.mockResolvedValueOnce(user);
    const result = await service.findOne(user.id);
    expect(result).toEqual(user);
  });
});
```

### E2E Test

```typescript
describe('UsersController (e2e)', () => {
  it('GET /users — retorna lista paginada', () =>
    request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200));
});
```

---

## 2. Logging estruturado com Pino

```typescript
LoggerModule.forRootAsync({
  useFactory: (config: ConfigService) => ({
    pinoHttp: {
      level: config.get('LOG_LEVEL', 'info'),
      transport: config.get('NODE_ENV') !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
  }),
});
```

---

## 3. Geração de Recursos com CLI

```bash
nest g resource users                # CRUD completo
nest g module orders
nest g service orders --flat
nest g guard auth/jwt-auth
```

---

## 4. Estrutura de pastas recomendada

```
src/
├── core/                    # Módulo global (logger, config, etc.)
├── shared/                  # DTOs, utils, constantes
├── modules/                 # Domínios de negócio
│   └── users/
└── main.ts
```

---

## 5. Checklist de Qualidade

- [ ] ValidationPipe global ativado
- [ ] HttpExceptionFilter global para erros padronizados
- [ ] Graceful shutdown com `enableShutdownHooks()`
- [ ] Health checks configurados
- [ ] Cobertura de testes ≥ 80% em services
- [ ] Swagger documentado e funcional
