/*
  Warnings:

  - You are about to drop the `DeletedTodo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DeletedTodoTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeletedTodo" DROP CONSTRAINT "DeletedTodo_userId_fkey";

-- DropForeignKey
ALTER TABLE "_DeletedTodoTag" DROP CONSTRAINT "_DeletedTodoTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeletedTodoTag" DROP CONSTRAINT "_DeletedTodoTag_B_fkey";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "DeletedTodo";

-- DropTable
DROP TABLE "_DeletedTodoTag";
