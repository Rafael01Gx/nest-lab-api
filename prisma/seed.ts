import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ==================== LABORATÓRIOS EXTERNOS ====================
  console.log('🔬 Criando Laboratórios Externos...');
  const labSenai = await prisma.laboratorioExterno.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'SENAI / FIEMG',
      endereco: JSON.stringify({
        cep: '31035536',
        logradouro: 'Rua Sete',
        numero: '2001',
        complemento: '',
        bairro: 'Horto Florestal',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        pais: 'Brasil',
      }),
      telefone: '3134892000',
      email: '',
    },
  });

  const labSGS = await prisma.laboratorioExterno.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nome: 'SGS DO BRASIL',
      endereco: JSON.stringify({
        cep: '33206369',
        logradouro: 'Avenida Mário Fonseca Viana',
        numero: '120-B',
        complemento: '',
        bairro: 'Angicos',
        cidade: 'Vespasiano',
        estado: 'MG',
        pais: 'Brasil',
      }),
      telefone: '3130450261',
      email: '',
    },
  });
  console.log('   ✅ 2 laboratório(s) criado(s)\n');

  // ==================== ELEMENTOS QUÍMICOS ====================
  console.log('⚗️  Criando Elementos Químicos...');
  const elementosData = [
    { id: 1, elementName: 'Cinzas', simbolo: 'Cz' },
    { id: 2, elementName: 'Matérias voláteis', simbolo: 'Mv' },
    { id: 3, elementName: 'C.fixo', simbolo: 'Cf' },
    { id: 4, elementName: 'Ferro', simbolo: 'Fe' },
    { id: 5, elementName: 'Dióxido de Silício', simbolo: 'SiO₂' },
    { id: 6, elementName: 'Óxido Ferroso', simbolo: 'FeO' },
    { id: 7, elementName: 'Óxido Férrico', simbolo: 'Fe₂O₃' },
    { id: 8, elementName: 'Óxido de Cálcio', simbolo: 'CaO' },
    { id: 9, elementName: 'Óxido de Alumínio', simbolo: 'Al₂O₃' },
    { id: 10, elementName: 'Óxido de Magnésio', simbolo: 'MgO' },
    { id: 11, elementName: 'Óxido de Potássio', simbolo: 'K₂O' },
    { id: 12, elementName: 'Óxido de Sódio', simbolo: 'Na₂O' },
    { id: 13, elementName: 'Zinco', simbolo: 'Zn' },
    { id: 14, elementName: 'Cromo', simbolo: 'Cr' },
    { id: 15, elementName: 'Manganês', simbolo: 'Mn' },
    { id: 16, elementName: 'PPC', simbolo: 'PPC' },
    { id: 17, elementName: 'Fósforo', simbolo: 'P' },
    { id: 18, elementName: 'Dióxido de Titânio', simbolo: 'TiO₂' },
    { id: 19, elementName: 'Enxofre', simbolo: 'S' },
    { id: 20, elementName: 'Carbono', simbolo: 'C' },
  ];

  for (const elemento of elementosData) {
    await prisma.elementoQuimico.upsert({
      where: { id: elemento.id },
      update: {},
      create: elemento,
    });
  }
  console.log(`   ✅ ${elementosData.length} elemento(s) criado(s)\n`);

  // ==================== AMOSTRAS LAB EXTERNO ====================
  console.log('🧪 Criando Amostras de Laboratório Externo...');
  const amostrasData = [
    { id: 1, amostraName: 'Antracito' },
    { id: 2, amostraName: 'Coque Metalúrgico' },
    { id: 3, amostraName: 'Escória de Alto Forno' },
    { id: 4, amostraName: 'ICP' },
    { id: 5, amostraName: 'Lama' },
    { id: 6, amostraName: 'Coque Interno' },
    { id: 7, amostraName: 'Minério Manganês' },
    { id: 8, amostraName: 'Pelota VSB' },
    { id: 9, amostraName: 'Pó Coletor' },
    { id: 10, amostraName: 'Sínter Enfornado' },
    { id: 11, amostraName: 'Calcário Calcítico' },
    { id: 12, amostraName: 'MPR' },
    { id: 13, amostraName: 'Minério Magnesiano' },
    { id: 14, amostraName: 'Minério de Ferro SFCON' },
    { id: 15, amostraName: 'Small-Coque' },
    { id: 16, amostraName: 'Finos da Sinterização' },
    { id: 17, amostraName: 'Pelota VLR' },
    { id: 18, amostraName: 'Minério de Ferro TCM 04' },
    { id: 19, amostraName: 'Minério de Ferro' },
  ];

  for (const amostra of amostrasData) {
    await prisma.amostraLabExterno.upsert({
      where: { id: amostra.id },
      update: {},
      create: amostra,
    });
  }
  console.log(`   ✅ ${amostrasData.length} amostra(s) criada(s)\n`);

  // ==================== RELACIONAMENTO AMOSTRA <-> ELEMENTOS ====================
  console.log('🔗 Criando relacionamentos Amostra-Elementos...');
  const relacionamentos = [
    { amostraId: 1, elementosIds: [1, 4, 5, 8, 9, 10, 11, 12, 13, 17, 19] },
    {
      amostraId: 2,
      elementosIds: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 17, 19],
    },
    { amostraId: 3, elementosIds: [11, 12, 13] },
    { amostraId: 4, elementosIds: [1, 11, 12, 13, 19] },
    { amostraId: 5, elementosIds: [1, 4, 5, 6, 7, 8, 10, 11, 12, 13, 17, 20] },
    { amostraId: 6, elementosIds: [1, 4, 5, 8, 9, 10, 11, 12, 13, 17, 19] },
    {
      amostraId: 7,
      elementosIds: [4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    {
      amostraId: 8,
      elementosIds: [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    { amostraId: 9, elementosIds: [1, 4, 11, 12, 13, 19, 20] },
    { amostraId: 10, elementosIds: [11, 12, 13, 19] },
    {
      amostraId: 11,
      elementosIds: [4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    },
    {
      amostraId: 12,
      elementosIds: [1, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 17, 20],
    },
    {
      amostraId: 13,
      elementosIds: [4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    {
      amostraId: 14,
      elementosIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    },
    { amostraId: 15, elementosIds: [1, 11, 12, 13, 19] },
    {
      amostraId: 16,
      elementosIds: [1, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20],
    },
    {
      amostraId: 17,
      elementosIds: [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    {
      amostraId: 18,
      elementosIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    },
    {
      amostraId: 19,
      elementosIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    },
  ];

  for (const rel of relacionamentos) {
    await prisma.amostraLabExterno.update({
      where: { id: rel.amostraId },
      data: {
        elementosAnalisados: {
          connect: rel.elementosIds.map((id) => ({ id })),
        },
      },
    });
  }
  console.log(`   ✅ Relacionamentos criados\n`);
  // ==================== USUÁRIO ADMIN ====================
  console.log('👤 Criando usuário admin...');
  const adminEmail = 'admin@admin.com';
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    const passwordPlain = 'Senha@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordPlain, salt);

    await prisma.user.create({
      data: {
        id: 'af309495-f8b0-4c5c-90b3-772bac712403',
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '5599999999',
        area: 'GAPSI',
        funcao: 'Laboratorista',
        authorization: true,
        receives_email:true,
        role: 'ADMIN',
      },
    });

    console.log('   ✅ Usuário admin criado!');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Senha: ${passwordPlain}\n`);
  } else {
    console.log('   ✅ Usuário admin já existe\n');
  }

  console.log('✨ Seed concluído com sucesso!\n');
}

main()
  .catch((error) => {
    console.error('\n❌ ERRO NO SEED:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
