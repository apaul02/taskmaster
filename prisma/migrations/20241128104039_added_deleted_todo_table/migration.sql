-- CreateTable
CREATE TABLE "DeletedTodo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DeletedTodo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeletedTodo" ADD CONSTRAINT "DeletedTodo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
