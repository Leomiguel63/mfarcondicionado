import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = parseInt(event.context.params?.id || '0')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido'
    })
  }
  
  // GET /api/clientes/:id - Buscar por ID
  if (method === 'GET') {
    const cliente = await prisma.cliente.findUnique({
      where: { id }
    })
    if (!cliente) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cliente não encontrado'
      })
    }
    return cliente
  }
  
  // PUT /api/clientes/:id - Atualizar cliente
  if (method === 'PUT') {
    const data = await readBody(event)
    
    // Determinar o nome principal baseado no tipo
    let nomePrincipal = ''
    if (data.tipo === 'fisica') {
      nomePrincipal = data.nomeCompleto || ''
    } else if (data.tipo === 'juridica') {
      nomePrincipal = data.razaoSocial || data.nomeFantasia || ''
    }
    
    const clienteAtualizado = await prisma.cliente.update({
      where: { id },
      data: {
        ...data,
        nome: nomePrincipal, // Campo legado para compatibilidade
        telefone: data.celular || data.telefoneFixo || data.telefoneResponsavel || '' // Campo legado para compatibilidade
      }
    })
    return clienteAtualizado
  }
  
  // DELETE /api/clientes/:id - Deletar cliente
  if (method === 'DELETE') {
    // Verifica se há orçamentos vinculados
    const orcamentos = await prisma.orcamento.findMany({ where: { clienteId: id } })
    if (orcamentos.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Não é possível apagar clientes com orçamentos vinculados.'
      })
    }
    await prisma.cliente.delete({
      where: { id }
    })
    return { message: 'Cliente deletado com sucesso' }
  }
  
  throw createError({
    statusCode: 405,
    statusMessage: 'Método não suportado'
  })
}) 