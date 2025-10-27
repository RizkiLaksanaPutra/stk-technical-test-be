/*
  Warnings:

  - You are about to drop the `menu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `menu` DROP FOREIGN KEY `Menu_parentId_fkey`;

-- DropTable
DROP TABLE `menu`;

-- CreateTable
CREATE TABLE `menus` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `depth` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `menus_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `menus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
