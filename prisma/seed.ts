
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = 'R87559301@lr'; 
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(passwordPlain, salt);

  await prisma.user.upsert({
    where: { email: 'rafael_junio_moraes@hotmail.com' },
    update: {},
    create: {
      id: 'af309495-f8b0-4c5c-90b3-772bac712403',
      name: 'Rafael',
      email: 'rafael_junio_moraes@hotmail.com',
      password: hashedPassword,
      phone: '31992482029',
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
