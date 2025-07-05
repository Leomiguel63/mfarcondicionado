import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method
  const clienteId = parseInt(event.context.params?.id || '0')
  
  if (!clienteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do cliente inválido'
    })
  }
  
  // GET /api/orcamentos/cliente/:id - Buscar orçamentos por cliente
  if (method === 'GET') {
    console.log('Buscando orçamentos para cliente ID:', clienteId)
    
    try {
      const orcamentos = await prisma.orcamento.findMany({
        where: {
          clienteId
        },
        orderBy: {
          data: 'desc'
        }
      })
      
      console.log('Orçamentos encontrados:', orcamentos)
      return orcamentos
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro interno do servidor ao buscar orçamentos'
      })
    }
  }
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Método não suportado'
  })
}) 