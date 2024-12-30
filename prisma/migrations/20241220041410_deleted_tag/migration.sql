-- CreateTable
CREATE TABLE "_DeletedTodoTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeletedTodoTag_AB_unique" ON "_DeletedTodoTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DeletedTodoTag_B_index" ON "_DeletedTodoTag"("B");

-- AddForeignKey
ALTER TABLE "_DeletedTodoTag" ADD CONSTRAINT "_DeletedTodoTag_A_fkey" FOREIGN KEY ("A") REFERENCES "DeletedTodo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeletedTodoTag" ADD CONSTRAINT "_DeletedTodoTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
