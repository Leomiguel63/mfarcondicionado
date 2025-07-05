import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method
  
  // GET /api/orcamentos - Listar todos
  if (method === 'GET') {
    const orcamentos = await prisma.orcamento.findMany({
      include: {
        cliente: true
      },
      orderBy: {
        data: 'desc'
      }
    })
    return orcamentos
  }
  
  // POST /api/orcamentos - Criar novo orçamento
  if (method === 'POST') {
    const data = await readBody(event)
    
    console.log('Dados recebidos na API:', data)
    
    try {
      // Validar dados obrigatórios
      if (!data.clienteId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID do cliente é obrigatório'
        })
      }

      // Preparar dados para salvar
      const dadosOrcamento = {
        clienteId: parseInt(data.clienteId),
        data: data.data ? new Date(data.data) : new Date(),
        valorTotal: parseFloat(data.valorTotal || 0),
        descricao: data.descricao || '',
        observacoes: data.observacoes || null,
        maoDeObra: parseFloat(data.maoDeObra || 0),
        pecas: data.pecas ? JSON.stringify(data.pecas) : null
      }

      console.log('Dados preparados para salvar:', dadosOrcamento)

      const novoOrcamento = await prisma.orcamento.create({
        data: dadosOrcamento,
        include: {
          cliente: true
        }
      })
      
      console.log('Orçamento criado com sucesso:', novoOrcamento)
      return novoOrcamento
    } catch (error: any) {
      console.error('Erro detalhado ao criar orçamento:', error)
      
      // Se for erro de validação do Prisma, retornar mensagem mais específica
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Orçamento já existe'
        })
      }
      
      if (error.code === 'P2003') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Cliente não encontrado'
        })
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: `Erro interno do servidor: ${error.message || 'Erro desconhecido'}`
      })
    }
  }
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Método não suportado'
  })
}) 