<template>
  <div class="container mt-5">
    <h2>Teste de Orçamentos</h2>
    
    <!-- Teste de Criação de Cliente -->
    <div class="card mb-4">
      <div class="card-header">
        <h4>Criar Cliente de Teste</h4>
      </div>
      <div class="card-body">
        <button @click="criarClienteTeste" class="btn btn-warning">
          Criar Cliente de Teste
        </button>
        <div v-if="resultadoCliente" class="mt-3">
          <pre>{{ resultadoCliente }}</pre>
        </div>
      </div>
    </div>

    <!-- Teste de Criação -->
    <div class="card mb-4">
      <div class="card-header">
        <h4>Criar Orçamento de Teste</h4>
      </div>
      <div class="card-body">
        <button @click="criarOrcamentoTeste" class="btn btn-primary">
          Criar Orçamento de Teste
        </button>
        <div v-if="resultadoCriacao" class="mt-3">
          <pre>{{ resultadoCriacao }}</pre>
        </div>
      </div>
    </div>

    <!-- Teste de Listagem -->
    <div class="card mb-4">
      <div class="card-header">
        <h4>Listar Todos os Orçamentos</h4>
      </div>
      <div class="card-body">
        <button @click="listarOrcamentos" class="btn btn-success">
          Listar Orçamentos
        </button>
        <div v-if="orcamentos.length > 0" class="mt-3">
          <h5>Orçamentos encontrados: {{ orcamentos.length }}</h5>
          <div v-for="orcamento in orcamentos" :key="orcamento.id" class="border p-2 mb-2">
            <strong>ID:</strong> {{ orcamento.id }}<br>
            <strong>Cliente ID:</strong> {{ orcamento.clienteId }}<br>
            <strong>Data:</strong> {{ orcamento.data }}<br>
            <strong>Valor:</strong> R$ {{ orcamento.valorTotal }}<br>

            <strong>Mão de Obra:</strong> R$ {{ orcamento.maoDeObra }}<br>
            <strong>Peças:</strong> {{ orcamento.pecas }}
          </div>
        </div>
      </div>
    </div>

    <!-- Teste por Cliente -->
    <div class="card mb-4">
      <div class="card-header">
        <h4>Buscar Orçamentos por Cliente</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <input v-model="clienteId" type="number" class="form-control" placeholder="ID do Cliente">
          </div>
          <div class="col-md-6">
            <button @click="buscarPorCliente" class="btn btn-info">
              Buscar por Cliente
            </button>
          </div>
        </div>
        <div v-if="orcamentosCliente.length > 0" class="mt-3">
          <h5>Orçamentos do cliente {{ clienteId }}: {{ orcamentosCliente.length }}</h5>
          <div v-for="orcamento in orcamentosCliente" :key="orcamento.id" class="border p-2 mb-2">
            <strong>ID:</strong> {{ orcamento.id }}<br>
            <strong>Data:</strong> {{ orcamento.data }}<br>
            <strong>Valor:</strong> R$ {{ orcamento.valorTotal }}<br>
            <strong>Mão de Obra:</strong> R$ {{ orcamento.maoDeObra }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Orcamento {
  id: number
  clienteId: number
  data: string
  valorTotal: number
  descricao?: string
  observacoes?: string
  maoDeObra: number
  pecas?: string
  criadoEm: string
}

const resultadoCriacao = ref('')
const resultadoCliente = ref('')
const orcamentos = ref<Orcamento[]>([])
const orcamentosCliente = ref<Orcamento[]>([])
const clienteId = ref('')

async function criarClienteTeste() {
  try {
    const response = await fetch('/api/teste-cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      const resultado = await response.json()
      resultadoCliente.value = JSON.stringify(resultado, null, 2)
      console.log('Cliente criado com sucesso:', resultado)
    } else {
      const error = await response.text()
      resultadoCliente.value = `Erro: ${response.status} - ${error}`
      console.error('Erro ao criar cliente:', error)
    }
  } catch (error) {
    resultadoCliente.value = `Erro: ${error}`
    console.error('Erro ao criar cliente:', error)
  }
}

async function criarOrcamentoTeste() {
  try {
    // Primeiro, vamos buscar um cliente existente
    const responseClientes = await fetch('/api/clientes')
    if (!responseClientes.ok) {
      alert('Erro ao buscar clientes. Crie um cliente primeiro.')
      return
    }
    
    const clientes = await responseClientes.json()
    if (clientes.length === 0) {
      alert('Nenhum cliente encontrado. Crie um cliente primeiro.')
      return
    }
    
    const clienteId = clientes[0].id // Usar o primeiro cliente disponível
    
    const dados = {
      clienteId: clienteId,
      data: new Date().toISOString(),
      valorTotal: 150.00,
      descricao: 'Orçamento de teste',
      maoDeObra: 50.00,
      pecas: [
        {
          descricao: 'Filtro de ar',
          valorUnitario: 25.00,
          quantidade: 2,
          valorTotal: 50.00
        },
        {
          descricao: 'Gás refrigerante',
          valorUnitario: 50.00,
          quantidade: 1,
          valorTotal: 50.00
        }
      ]
    }

    console.log('Criando orçamento de teste:', dados)

    const response = await fetch('/api/orcamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })

    if (response.ok) {
      const resultado = await response.json()
      resultadoCriacao.value = JSON.stringify(resultado, null, 2)
      console.log('Orçamento criado com sucesso:', resultado)
    } else {
      const error = await response.text()
      resultadoCriacao.value = `Erro: ${response.status} - ${error}`
      console.error('Erro ao criar orçamento:', error)
    }
  } catch (error) {
    resultadoCriacao.value = `Erro: ${error}`
    console.error('Erro ao criar orçamento:', error)
  }
}

async function listarOrcamentos() {
  try {
    const response = await fetch('/api/orcamentos')
    if (response.ok) {
      orcamentos.value = await response.json()
      console.log('Orçamentos listados:', orcamentos.value)
    } else {
      console.error('Erro ao listar orçamentos:', response.status)
    }
  } catch (error) {
    console.error('Erro ao listar orçamentos:', error)
  }
}

async function buscarPorCliente() {
  if (!clienteId.value) {
    alert('Digite um ID de cliente')
    return
  }

  try {
    const response = await fetch(`/api/orcamentos/cliente/${clienteId.value}`)
    if (response.ok) {
      orcamentosCliente.value = await response.json()
      console.log('Orçamentos do cliente:', orcamentosCliente.value)
    } else {
      console.error('Erro ao buscar orçamentos do cliente:', response.status)
    }
  } catch (error) {
    console.error('Erro ao buscar orçamentos do cliente:', error)
  }
}
</script> 