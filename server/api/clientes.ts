import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method
  
  // GET /api/clientes - Listar todos
  if (method === 'GET') {
    const clientes = await prisma.cliente.findMany({ 
      orderBy: [
        { tipo: 'asc' },
        { nomeCompleto: 'asc' },
        { razaoSocial: 'asc' },
        { nome: 'asc' }
      ] 
    })
    return clientes
  }
  
  // POST /api/clientes - Criar novo cliente
  if (method === 'POST') {
    const data = await readBody(event)
    
    // Determinar o nome principal baseado no tipo
    let nomePrincipal = ''
    if (data.tipo === 'fisica') {
      nomePrincipal = data.nomeCompleto || ''
    } else if (data.tipo === 'juridica') {
      nomePrincipal = data.razaoSocial || data.nomeFantasia || ''
    }
    
    // Criar cliente com dados completos
    const novoCliente = await prisma.cliente.create({ 
      data: {
        ...data,
        nome: nomePrincipal, // Campo legado para compatibilidade
        telefone: data.celular || data.telefoneFixo || data.telefoneResponsavel || '' // Campo legado para compatibilidade
      }
    })
    return novoCliente
  }
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Método não suportado'
  })
}) 