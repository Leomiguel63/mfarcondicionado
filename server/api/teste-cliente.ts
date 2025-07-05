import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.method
  
  if (method === 'POST') {
    try {
      const cliente = await prisma.cliente.create({
        data: {
          tipo: 'fisica',
          nomeCompleto: 'João Silva Teste',
          cpf: '123.456.789-00',
          email: 'joao@teste.com',
          celular: '(11) 99999-9999',
          cidade: 'São Paulo',
          estado: 'SP'
        }
      })
      
      return {
        success: true,
        cliente,
        message: 'Cliente de teste criado com sucesso'
      }
    } catch (error: any) {
      console.error('Erro ao criar cliente de teste:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  return {
    success: false,
    message: 'Método não suportado'
  }
}) 