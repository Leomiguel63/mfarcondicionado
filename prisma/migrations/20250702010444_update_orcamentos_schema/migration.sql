/*
  Warnings:

  - You are about to drop the `OrcamentoMaoDeObra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrcamentoPeca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `carro` on the `Orcamento` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrcamentoMaoDeObra";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrcamentoPeca";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL DEFAULT 'fisica',
    "nomeCompleto" TEXT,
    "cpf" TEXT,
    "rg" TEXT,
    "dataNascimento" TEXT,
    "genero" TEXT,
    "estadoCivil" TEXT,
    "razaoSocial" TEXT,
    "nomeFantasia" TEXT,
    "cnpj" TEXT,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "responsavelLegal" TEXT,
    "cpfResponsavel" TEXT,
    "telefoneResponsavel" TEXT,
    "email" TEXT,
    "telefoneFixo" TEXT,
    "celular" TEXT,
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "pais" TEXT DEFAULT 'Brasil',
    "inscricaoEstadualFiscal" TEXT,
    "classificacaoFiscal" TEXT,
    "nome" TEXT,
    "telefone" TEXT,
    "observacoes" TEXT,
    "dataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'ativo'
);
INSERT INTO "new_Cliente" ("bairro", "celular", "cep", "cidade", "classificacaoFiscal", "cnpj", "complemento", "cpf", "cpfResponsavel", "dataNascimento", "email", "estado", "estadoCivil", "genero", "id", "inscricaoEstadual", "inscricaoEstadualFiscal", "inscricaoMunicipal", "logradouro", "nome", "nomeCompleto", "nomeFantasia", "numero", "pais", "razaoSocial", "responsavelLegal", "rg", "telefone", "telefoneFixo", "telefoneResponsavel", "tipo") SELECT "bairro", "celular", "cep", "cidade", "classificacaoFiscal", "cnpj", "complemento", "cpf", "cpfResponsavel", "dataNascimento", "email", "estado", "estadoCivil", "genero", "id", "inscricaoEstadual", "inscricaoEstadualFiscal", "inscricaoMunicipal", "logradouro", "nome", "nomeCompleto", "nomeFantasia", "numero", "pais", "razaoSocial", "responsavelLegal", "rg", "telefone", "telefoneFixo", "telefoneResponsavel", "tipo" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE TABLE "new_Orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" REAL NOT NULL DEFAULT 0,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orcamento" ("clienteId", "criadoEm", "descricao", "id") SELECT "clienteId", "criadoEm", "descricao", "id" FROM "Orcamento";
DROP TABLE "Orcamento";
ALTER TABLE "new_Orcamento" RENAME TO "Orcamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
