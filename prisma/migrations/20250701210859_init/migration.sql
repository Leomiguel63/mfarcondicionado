-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "telefone" TEXT
);

-- CreateTable
CREATE TABLE "Peca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT,
    "quantidade" INTEGER NOT NULL,
    "valor" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "carro" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrcamentoPeca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orcamentoId" INTEGER NOT NULL,
    "pecaId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    CONSTRAINT "OrcamentoPeca_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrcamentoPeca_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES "Peca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrcamentoMaoDeObra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orcamentoId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    CONSTRAINT "OrcamentoMaoDeObra_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
