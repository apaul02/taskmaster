-- CreateTable
CREATE TABLE "_TodoTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TodoTag_AB_unique" ON "_TodoTag"("A", "B");

-- CreateIndex
CREATE INDEX "_TodoTag_B_index" ON "_TodoTag"("B");

-- AddForeignKey
ALTER TABLE "_TodoTag" ADD CONSTRAINT "_TodoTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoTag" ADD CONSTRAINT "_TodoTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
