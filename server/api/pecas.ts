import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method

  // GET /api/pecas - Listar todas as peças
  if (method === 'GET') {
    const pecas = await prisma.peca.findMany({
      orderBy: { id: 'desc' }
    })
    return pecas
  }

  // POST /api/pecas - Criar nova peça
  if (method === 'POST') {
    const data = await readBody(event)
    try {
      if (!data.nome || !data.codigo) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nome e código são obrigatórios'
        })
      }
      const novaPeca = await prisma.peca.create({
        data: {
          nome: data.nome,
          codigo: data.codigo,
          quantidade: parseInt(data.quantidade),
          valor: parseFloat(data.valor)
        }
      })
      return novaPeca
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Erro ao criar peça'
      })
    }
  }

  // PUT /api/pecas - Atualizar quantidade e valor de uma peça
  if (method === 'PUT') {
    const data = await readBody(event)
    try {
      if (!data.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID da peça é obrigatório'
        })
      }
      const pecaAtualizada = await prisma.peca.update({
        where: { id: Number(data.id) },
        data: {
          quantidade: data.quantidade !== undefined ? parseInt(data.quantidade) : undefined,
          valor: data.valor !== undefined ? parseFloat(data.valor) : undefined
        }
      })
      return pecaAtualizada
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Erro ao atualizar peça'
      })
    }
  }

  // DELETE /api/pecas - Remover uma peça pelo ID
  if (method === 'DELETE') {
    const data = await readBody(event)
    try {
      if (!data.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID da peça é obrigatório'
        })
      }
      await prisma.peca.delete({ where: { id: Number(data.id) } })
      return { ok: true }
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Erro ao apagar peça'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Método não suportado'
  })
}) 