---
name: nestjs-core
description: >
  Fundamentos do NestJS: Setup, Módulos, Controllers, Providers, Dependency Injection, DTOs e Validation.
  Use para criar a estrutura básica da aplicação e fluxos de entrada/saída de dados.
---

# NestJS — Core Foundations

## 1. Setup & Bootstrap

### Instalação rápida

```bash
npm i -g @nestjs/cli
nest new project-name --strict
cd project-name
npm run start:dev
```

### Standalone Application (sem HTTP server)

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(MyService);
  await service.run();
  await app.close();
}
bootstrap();
```

### Fastify Adapter (alta performance)

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.listen(3000, '0.0.0.0');
}
```

### Prefixo global + Versioning

```typescript
app.setGlobalPrefix('api');
app.enableVersioning({ type: VersioningType.URI }); // /api/v1/...
app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') });
app.enableShutdownHooks(); // graceful shutdown
```

---

## 2. Módulos

### Estrutura recomendada de módulo

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

### Global Module

```typescript
@Global()
@Module({
  providers: [ConfigService, LoggerService],
  exports: [ConfigService, LoggerService],
})
export class CoreModule {}
```

### Dynamic Module com forRootAsync

```typescript
@Module({})
export class DatabaseModule {
  static forRootAsync(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: DATABASE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
```

### Lazy-loading Modules (v10+ — reduz tempo de boot)

```typescript
import { LazyModuleLoader } from '@nestjs/core';

@Injectable()
export class ReportService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async generatePdf() {
    const { PdfModule } = await import('./pdf/pdf.module');
    const moduleRef = await this.lazyModuleLoader.load(() => PdfModule);
    const pdfService = moduleRef.get(PdfService);
    return pdfService.generate();
  }
}
```

---

## 3. Controllers

### Controller com versioning e rotas REST

```typescript
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: PaginationDto): Promise<PageDto<UserDto>> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
```

---

## 4. Providers & Dependency Injection

### Service padrão

```typescript
@Injectable({ scope: Scope.DEFAULT }) // DEFAULT = Singleton (recomendado)
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly config: ConfigService,
  ) {}
}
```

### Scopes disponíveis

| Scope       | Comportamento                                            |
|-------------|----------------------------------------------------------|
| `DEFAULT`   | Singleton — uma instância por aplicação (padrão)        |
| `REQUEST`   | Nova instância por requisição HTTP                       |
| `TRANSIENT` | Nova instância para cada consumer                        |

> ⚠️ Evite `REQUEST` scope em hot paths — impacta performance.

### Custom Provider patterns

```typescript
// Value Provider
{ provide: APP_CONFIG, useValue: { timeout: 5000 } }

// Factory Provider
{
  provide: REDIS_CLIENT,
  useFactory: (config: ConfigService) =>
    createClient({ url: config.get('REDIS_URL') }),
  inject: [ConfigService],
}
```

---

## 5. DTOs, Validation & Pipes

### Configuração global de ValidationPipe

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,          // remove campos não declarados
    forbidNonWhitelisted: true,
    transform: true,          // auto-transforma tipos
    transformOptions: { enableImplicitConversion: true },
  }),
);
```

### DTO com class-validator

```typescript
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;
}
```

### Pipe customizado

```typescript
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: unknown): number {
    const val = parseInt(String(value), 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException('Valor deve ser um inteiro positivo');
    }
    return val;
  }
}
```
