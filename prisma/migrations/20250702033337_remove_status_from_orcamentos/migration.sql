/*
  Warnings:

  - You are about to drop the column `status` on the `Orcamento` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" REAL NOT NULL DEFAULT 0,
    "descricao" TEXT,
    "observacoes" TEXT,
    "maoDeObra" REAL NOT NULL DEFAULT 0,
    "pecas" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orcamento" ("clienteId", "criadoEm", "data", "descricao", "id", "maoDeObra", "observacoes", "pecas", "valorTotal") SELECT "clienteId", "criadoEm", "data", "descricao", "id", "maoDeObra", "observacoes", "pecas", "valorTotal" FROM "Orcamento";
DROP TABLE "Orcamento";
ALTER TABLE "new_Orcamento" RENAME TO "Orcamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
