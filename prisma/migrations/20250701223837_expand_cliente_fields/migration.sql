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
    "telefone" TEXT
);
INSERT INTO "new_Cliente" ("id", "nome", "telefone") SELECT "id", "nome", "telefone" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
