-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "body" TEXT,
    "updated_at" TEXT NOT NULL,
    "created_by" TEXT NOT NULL
);
