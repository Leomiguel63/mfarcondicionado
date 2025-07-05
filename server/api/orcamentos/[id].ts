import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method
  const orcamentoId = parseInt(event.context.params?.id || '0')
  
  if (!orcamentoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do orçamento inválido'
    })
  }
  
  // GET /api/orcamentos/:id - Buscar orçamento por ID
  if (method === 'GET') {
    try {
      const orcamento = await prisma.orcamento.findUnique({
        where: {
          id: orcamentoId
        },
        include: {
          cliente: true
        }
      })
      
      if (!orcamento) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Orçamento não encontrado'
        })
      }
      
      return orcamento
    } catch (error: any) {
      console.error('Erro ao buscar orçamento:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor ao buscar orçamento'
      })
    }
  }
  
  // PUT /api/orcamentos/:id - Atualizar orçamento
  if (method === 'PUT') {
    const data = await readBody(event)
    
    const orcamentoAtualizado = await prisma.orcamento.update({
      where: { id: orcamentoId },
      data: {
        clienteId: data.clienteId,
        data: data.data,
        valorTotal: data.valorTotal,
        descricao: data.descricao,
        status: data.status,
        observacoes: data.observacoes
      },
      include: {
        cliente: true
      }
    })
    return orcamentoAtualizado
  }
  
  // DELETE /api/orcamentos/:id - Deletar orçamento
  if (method === 'DELETE') {
    try {
      const orcamento = await prisma.orcamento.delete({
        where: {
          id: orcamentoId
        }
      })
      
      return { success: true, message: 'Orçamento deletado com sucesso' }
    } catch (error: any) {
      console.error('Erro ao deletar orçamento:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor ao deletar orçamento'
      })
    }
  }
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Método não suportado'
  })
}) 