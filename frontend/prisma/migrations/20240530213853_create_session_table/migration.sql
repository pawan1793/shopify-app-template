-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191),
    `expires` DATETIME(3),
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT,
    `firstName` VARCHAR(191),
    `lastName` VARCHAR(191),
    `email` VARCHAR(191),
    `accountOwner` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(191),
    `collaborator` BOOLEAN DEFAULT false,
    `emailVerified` BOOLEAN DEFAULT false,
    `laravelToken` TEXT,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
