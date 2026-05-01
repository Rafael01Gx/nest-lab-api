---
name: nestjs-persistence
description: >
  Persistência e Configuração no NestJS: @nestjs/config, TypeORM, Integração com Prisma e Health Checks (Terminus).
  Use para configurar acesso a bancos de dados e variáveis de ambiente.
---

# NestJS — Persistence & Configuration

## 1. Configuration (@nestjs/config)

### Setup moderno com validação Zod

```typescript
// config/env.validation.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
});

export function validate(config: Record<string, unknown>) {
  return envSchema.parse(config);
}

// app.module.ts
ConfigModule.forRoot({ isGlobal: true, validate, cache: true }),
```

---

## 2. TypeORM Integration

### Setup assíncrono

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    url: config.get('DATABASE_URL'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: config.get('NODE_ENV') === 'development',
  }),
  inject: [ConfigService],
}),
```

### Entity com boas práticas

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null; // soft delete
}
```

---

## 3. Prisma Integration

```typescript
// prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

---

## 4. Health Checks (@nestjs/terminus)

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```
