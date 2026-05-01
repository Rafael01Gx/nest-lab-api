---
name: nestjs-advanced
description: >
  Recursos Avançados no NestJS: Caching, Filas (BullMQ), Eventos, WebSockets, CQRS e Microserviços.
  Use para sistemas distribuídos, processamento assíncrono e tempo real.
---

# NestJS — Advanced Topics

## 1. Cache (@nestjs/cache-manager)

```typescript
// app.module.ts
CacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => ({
    store: await redisStore({ url: config.get('REDIS_URL') }),
    ttl: 60000,
  }),
  inject: [ConfigService],
}),
```

---

## 2. Filas com BullMQ (@nestjs/bullmq)

```typescript
// Producer
@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async sendWelcomeEmail(userId: string): Promise<void> {
    await this.emailQueue.add('welcome', { userId });
  }
}

// Consumer
@Processor('email')
export class EmailProcessor extends WorkerHost {
  @Process('welcome')
  async handleWelcome(job: Job<{ userId: string }>): Promise<void> {
    // lógica de envio...
  }
}
```

---

## 3. Events (@nestjs/event-emitter)

```typescript
// Emitindo
this.events.emit('order.created', new OrderCreatedEvent(order));

// Escutando
@OnEvent('order.created', { async: true })
async handleOrderCreated(event: OrderCreatedEvent): Promise<void> { ... }
```

---

## 4. WebSockets (@nestjs/websockets)

```typescript
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('send-message')
  handleMessage(@MessageBody() dto: SendMessageDto) {
    this.server.emit('new-message', dto);
  }
}
```

---

## 5. CQRS (@nestjs/cqrs)

```typescript
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand) { ... }
}
```

---

## 6. Microserviços

### TCP Transport

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: { host: '0.0.0.0', port: 3001 },
});
```
