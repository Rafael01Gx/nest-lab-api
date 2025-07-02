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
    `role` VARCHAR(191) NULL DEFAULT 'Usuário',
    `passwordResetToken` VARCHAR(191) NULL,
    `passwordResetExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
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
    `tipo_analise_id` INTEGER NOT NULL,
    `unidade_medida` VARCHAR(191) NULL DEFAULT '',
    `descricao` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amostra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroOs` VARCHAR(191) NOT NULL,
    `nome_amostra` VARCHAR(191) NOT NULL,
    `data_amostra` VARCHAR(191) NOT NULL,
    `ensaios_solicitados` VARCHAR(191) NOT NULL,
    `amostra_tipo` VARCHAR(191) NULL DEFAULT 'Não definido',
    `userId` VARCHAR(191) NOT NULL,
    `resultados` JSON NULL,
    `analistas` JSON NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Aguardando Autorização',
    `progresso` INTEGER NOT NULL DEFAULT 0,
    `prazo_inicio_fim` VARCHAR(191) NULL DEFAULT 'Aguardando',
    `data_recepcao` VARCHAR(191) NULL DEFAULT 'Aguardando',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfiguracaoAnalise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_analise_id` INTEGER NOT NULL,
    `materia_prima_id` INTEGER NOT NULL,
    `parametros` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MateriaPrima` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_descricao` VARCHAR(191) NOT NULL DEFAULT '',
    `classe_tipo` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParametrosAnalise` ADD CONSTRAINT `ParametrosAnalise_tipo_analise_id_fkey` FOREIGN KEY (`tipo_analise_id`) REFERENCES `TipoAnalise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Amostra` ADD CONSTRAINT `Amostra_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfiguracaoAnalise` ADD CONSTRAINT `ConfiguracaoAnalise_tipo_analise_id_fkey` FOREIGN KEY (`tipo_analise_id`) REFERENCES `TipoAnalise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfiguracaoAnalise` ADD CONSTRAINT `ConfiguracaoAnalise_materia_prima_id_fkey` FOREIGN KEY (`materia_prima_id`) REFERENCES `MateriaPrima`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
