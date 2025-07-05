-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL DEFAULT '',
    `area` VARCHAR(191) NULL DEFAULT '',
    `funcao` VARCHAR(191) NULL DEFAULT '',
    `authorization` BOOLEAN NULL DEFAULT false,
    `role` ENUM('Usuário', 'Operador', 'Administrador') NOT NULL DEFAULT 'Usuário',
    `passwordResetToken` VARCHAR(191) NULL,
    `passwordResetExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `message` VARCHAR(191) NOT NULL DEFAULT '',
    `data` VARCHAR(191) NOT NULL DEFAULT '',
    `read` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoAnalise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL DEFAULT '',
    `classe` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParametrosAnalise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoAnaliseId` INTEGER NOT NULL,
    `unidadeMedida` VARCHAR(191) NULL DEFAULT '',
    `descricao` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfiguracaoAnalise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoAnaliseId` INTEGER NOT NULL,
    `materiaPrimaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MateriaPrima` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeDescricao` VARCHAR(191) NOT NULL DEFAULT '',
    `classeTipo` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amostra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroOs` VARCHAR(191) NOT NULL,
    `nomeAmostra` VARCHAR(191) NOT NULL,
    `dataAmostra` VARCHAR(191) NOT NULL,
    `ensaiosSolicitados` JSON NULL,
    `amostraTipo` VARCHAR(191) NULL DEFAULT 'Não definido',
    `userId` VARCHAR(191) NOT NULL,
    `resultados` JSON NULL,
    `analistas` JSON NULL,
    `status` ENUM('Aguardando Autorização', 'Autorizada', 'Em Execução', 'Finalizada', 'Cancelada') NOT NULL DEFAULT 'Aguardando Autorização',
    `progresso` INTEGER NOT NULL DEFAULT 0,
    `prazoInicioFim` VARCHAR(191) NULL DEFAULT 'Aguardando',
    `dataRecepcao` VARCHAR(191) NULL DEFAULT 'Aguardando',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdemServico` (
    `id` VARCHAR(191) NOT NULL,
    `numeroOs` VARCHAR(191) NOT NULL,
    `solicitanteId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT '',
    `dataRecepcao` VARCHAR(191) NOT NULL DEFAULT '',
    `prazoInicioFim` VARCHAR(191) NOT NULL DEFAULT '',
    `progresso` VARCHAR(191) NULL DEFAULT '',
    `observacao` VARCHAR(191) NULL DEFAULT '',
    `revisorId` VARCHAR(191) NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ConfiguracaoAnaliseToParametrosAnalise` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ConfiguracaoAnaliseToParametrosAnalise_AB_unique`(`A`, `B`),
    INDEX `_ConfiguracaoAnaliseToParametrosAnalise_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParametrosAnalise` ADD CONSTRAINT `ParametrosAnalise_tipoAnaliseId_fkey` FOREIGN KEY (`tipoAnaliseId`) REFERENCES `TipoAnalise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfiguracaoAnalise` ADD CONSTRAINT `ConfiguracaoAnalise_tipoAnaliseId_fkey` FOREIGN KEY (`tipoAnaliseId`) REFERENCES `TipoAnalise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfiguracaoAnalise` ADD CONSTRAINT `ConfiguracaoAnalise_materiaPrimaId_fkey` FOREIGN KEY (`materiaPrimaId`) REFERENCES `MateriaPrima`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Amostra` ADD CONSTRAINT `Amostra_numeroOs_fkey` FOREIGN KEY (`numeroOs`) REFERENCES `OrdemServico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Amostra` ADD CONSTRAINT `Amostra_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdemServico` ADD CONSTRAINT `OrdemServico_solicitanteId_fkey` FOREIGN KEY (`solicitanteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfiguracaoAnaliseToParametrosAnalise` ADD CONSTRAINT `_ConfiguracaoAnaliseToParametrosAnalise_A_fkey` FOREIGN KEY (`A`) REFERENCES `ConfiguracaoAnalise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfiguracaoAnaliseToParametrosAnalise` ADD CONSTRAINT `_ConfiguracaoAnaliseToParametrosAnalise_B_fkey` FOREIGN KEY (`B`) REFERENCES `ParametrosAnalise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
