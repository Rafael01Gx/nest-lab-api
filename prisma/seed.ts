
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = 'Senha@123'; 
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(passwordPlain, salt);

  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      id: 'af309495-f8b0-4c5c-90b3-772bac712403',
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      phone: '5599999999',
      area: 'GAPSI',
      funcao: 'Laboratorista',
      authorization: true,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
