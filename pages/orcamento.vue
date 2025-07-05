<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="card shadow-lg border-0 orcamento-card" style="max-width: 900px; width: 100%; margin: 0 auto;">
      <div class="card-header text-center py-2 orcamento-header">
        <h3 class="text-white fw-bold mb-0 orcamento-title">
          <i class="bi bi-currency-dollar me-2"></i>
          Novo Orçamento
        </h3>
      </div>
      <div class="card-body p-2">
        <form @submit.prevent="salvarOrcamento">
          <!-- Seleção de Cliente -->
          <div class="row mb-3">
            <div class="col-12">
              <h5 class="fw-bold mb-2" style="color: #6c757d;">
                <i class="bi bi-person me-2"></i>
                Cliente
              </h5>
            </div>
            
            <!-- Busca e Seleção de Cliente -->
            <div class="col-md-8">
              <label class="form-label fw-bold" :class="getLabelClass(orcamento.clienteId)">
                <i class="bi bi-person-check me-1"></i>Buscar e Selecionar Cliente *
              </label>
              <div class="position-relative">
                <div class="input-group">
                  <span class="input-group-text" style="background: #1c74cb; border-color: #1c74cb; color: white;">
                    <i class="bi bi-search"></i>
                  </span>
                  <input 
                    v-model="buscaCliente" 
                    type="text" 
                    class="form-control" 
                    placeholder="Digite para buscar cliente por nome, CPF/CNPJ, telefone..."
                    @focus="mostrarSugestoes = true"
                    @blur="esconderSugestoes"
                  />
                </div>
                
                <!-- Lista de sugestões -->
                <div v-if="mostrarSugestoes && clientesFiltrados.length > 0" class="position-absolute w-100 bg-white border rounded-bottom shadow-sm" style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                  <div 
                    v-for="cliente in clientesFiltrados" 
                    :key="cliente.id"
                    class="p-2 border-bottom sugestao-item"
                    @click="selecionarCliente(cliente)"
                    style="cursor: pointer;"
                  >
                    <div class="fw-bold">{{ getNomePrincipal(cliente) }}</div>
                    <small class="text-muted">
                      {{ cliente.tipo === 'fisica' ? 'CPF: ' + (cliente.cpf || 'N/I') : 'CNPJ: ' + (cliente.cnpj || 'N/I') }}
                      <span v-if="cliente.celular" class="ms-2">| {{ cliente.celular }}</span>
                    </small>
                  </div>
                </div>
              </div>
              
              <!-- Cliente selecionado -->
              <div v-if="clienteSelecionado" class="mt-2 p-2 bg-light rounded border">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ getNomePrincipal(clienteSelecionado) }}</strong>
                    <br>
                    <small class="text-muted">
                      {{ clienteSelecionado.tipo === 'fisica' ? 'CPF: ' + (clienteSelecionado.cpf || 'N/I') : 'CNPJ: ' + (clienteSelecionado.cnpj || 'N/I') }}
                      <span v-if="clienteSelecionado.celular" class="ms-2">| {{ clienteSelecionado.celular }}</span>
                    </small>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn-sm btn-outline-danger"
                    @click="limparClienteSelecionado"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <label class="form-label fw-bold" :class="getLabelClass(orcamento.data)">
                <i class="bi bi-calendar me-1"></i>Data do Orçamento
              </label>
              <input v-model="orcamento.data" type="date" class="form-control" />
            </div>
          </div>

          <!-- Informações do Orçamento -->
          <div class="row mb-3">
            <div class="col-12">
              <h5 class="fw-bold mb-2" style="color: #6c757d;">
                <i class="bi bi-file-text me-2"></i>
                Informações do Orçamento
              </h5>
            </div>
            <div class="col-12">
              <label class="form-label fw-bold" :class="getLabelClass(orcamento.descricao)">
                <i class="bi bi-chat-text me-1"></i>Descrição do Serviço
              </label>
              <textarea v-model="orcamento.descricao" class="form-control" rows="3" placeholder="Descreva o serviço a ser realizado..."></textarea>
            </div>
          </div>

          <!-- Peças e Valores -->
          <div class="row mb-3">
            <div class="col-12">
              <h5 class="fw-bold mb-2" style="color: #6c757d;">
                <i class="bi bi-tools me-2"></i>
                Peças e Valores
              </h5>
            </div>
            
            <!-- Lista de Peças -->
            <div class="col-12 mb-3">
              <div v-for="(peca, index) in pecas" :key="index" class="card mb-2 border-0" style="background-color: #f8f9fa;">
                <div class="card-body p-3">
                  <div class="row align-items-center">
                    <div class="col-md-5">
                      <label class="form-label fw-bold small mb-1">
                        <i class="bi bi-tag me-1"></i>Descrição da Peça
                      </label>
                      <input 
                        v-model="peca.descricao" 
                        type="text" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Filtro de ar, Compressor, etc."
                      />
                    </div>
                    <div class="col-md-3">
                      <label class="form-label fw-bold small mb-1">
                        <i class="bi bi-currency-dollar me-1"></i>Valor Unitário (R$)
                      </label>
                      <input 
                        v-model="peca.valorUnitario" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        class="form-control form-control-sm" 
                        placeholder="0,00"
                        @input="calcularValorPeca(index)"
                      />
                    </div>
                    <div class="col-md-2">
                      <label class="form-label fw-bold small mb-1">
                        <i class="bi bi-hash me-1"></i>Quantidade
                      </label>
                      <input 
                        v-model="peca.quantidade" 
                        type="number" 
                        min="1" 
                        class="form-control form-control-sm" 
                        placeholder="1"
                        @input="calcularValorPeca(index)"
                      />
                    </div>
                    <div class="col-md-2">
                      <label class="form-label fw-bold small mb-1">
                        <i class="bi bi-calculator me-1"></i>Total (R$)
                      </label>
                      <input 
                        :value="formatarMoeda(peca.valorTotal)" 
                        type="text" 
                        class="form-control form-control-sm" 
                        readonly
                        style="background-color: #e9ecef;"
                      />
                    </div>
                    <div class="col-12 mt-2 text-end">
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger"
                        @click="removerPeca(index)"
                      >
                        <i class="bi bi-trash me-1"></i>Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Botão Adicionar Peça -->
              <div class="text-center">
                <button 
                  type="button" 
                  class="btn btn-outline-primary btn-sm"
                  @click="adicionarPeca"
                >
                  <i class="bi bi-plus-circle me-1"></i>Adicionar Peça
                </button>
              </div>
            </div>
            

          </div>

          <!-- Mão de Obra e Valor Geral -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-bold" :class="getLabelClass(maoDeObra)">
                <i class="bi bi-person-workspace me-1"></i>Mão de Obra (R$)
              </label>
              <input 
                v-model="maoDeObra" 
                type="number" 
                step="0.01" 
                min="0" 
                class="form-control" 
                placeholder="0,00"
                @input="atualizarValorTotal"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">
                <i class="bi bi-calculator me-1"></i>Valor Geral (R$)
              </label>
              <input 
                :value="formatarMoeda(valorTotalGeral)" 
                type="text" 
                class="form-control" 
                readonly
                style="background-color: #e9ecef; font-weight: bold;"
              />
            </div>
          </div>

          <!-- Botões -->
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary fw-bold flex-fill">
              <i class="bi bi-check-circle me-2"></i>
              Salvar Orçamento
            </button>
            <button 
              type="button" 
              class="btn btn-success fw-bold"
              @click="imprimirOrcamento"
              :disabled="!clienteSelecionado"
            >
              <i class="bi bi-printer me-2"></i>
              Imprimir
            </button>
            <NuxtLink to="/clientes-lista" class="btn btn-secondary fw-bold">
              <i class="bi bi-arrow-left me-2"></i>
              Voltar
            </NuxtLink>
          </div>
          
          <div v-if="sucesso" class="alert alert-success mt-3 text-center fw-bold" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            Orçamento salvo com sucesso!
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'

interface Cliente {
  id?: number
  tipo?: 'fisica' | 'juridica'
  nomeCompleto?: string
  razaoSocial?: string
  nomeFantasia?: string
  cpf?: string
  cnpj?: string
  email?: string
  celular?: string
  telefoneFixo?: string
}

interface Peca {
  descricao: string
  valorUnitario: number
  quantidade: number
  valorTotal: number
}

interface Orcamento {
  clienteId: number | null
  data: string
  valorTotal: number | null
  descricao: string
  observacoes?: string
}

const orcamento = reactive<Orcamento>({
  clienteId: null,
  data: new Date().toISOString().split('T')[0],
  valorTotal: null,
  descricao: ''
})

const clientes = ref<Cliente[]>([])
const sucesso = ref(false)
const buscaCliente = ref('')
const mostrarSugestoes = ref(false)
const clienteSelecionado = ref<Cliente | null>(null)
const pecas = ref<Peca[]>([])
const maoDeObra = ref(0)

const subtotalPecas = computed(() => {
  return pecas.value.reduce((total, peca) => total + peca.valorTotal, 0)
})

const valorTotalGeral = computed(() => {
  return subtotalPecas.value + maoDeObra.value
})

const clientesFiltrados = computed(() => {
  if (!buscaCliente.value) return clientes.value
  const termo = buscaCliente.value.toLowerCase()
  return clientes.value.filter(cliente => {
    const nome = getNomePrincipal(cliente).toLowerCase()
    const cpfCnpj = (cliente.cpf || cliente.cnpj || '').toLowerCase()
    const telefone = (cliente.celular || cliente.telefoneFixo || '').toLowerCase()
    const email = (cliente.email || '').toLowerCase()
    
    return nome.includes(termo) || 
           cpfCnpj.includes(termo) || 
           telefone.includes(termo) ||
           email.includes(termo)
  })
})

function getNomePrincipal(cliente: Cliente): string {
  if (cliente.tipo === 'fisica') {
    return cliente.nomeCompleto || 'Nome não informado'
  } else {
    return cliente.razaoSocial || cliente.nomeFantasia || 'Razão social não informada'
  }
}

function getLabelClass(value: any): string {
  if (value === null || value === undefined || value === '') {
    return 'label-empty'
  }
  return 'label-filled'
}

function selecionarCliente(cliente: Cliente) {
  clienteSelecionado.value = cliente
  orcamento.clienteId = cliente.id || null
  buscaCliente.value = getNomePrincipal(cliente)
  mostrarSugestoes.value = false
}

function limparClienteSelecionado() {
  clienteSelecionado.value = null
  orcamento.clienteId = null
  buscaCliente.value = ''
}

function esconderSugestoes() {
  setTimeout(() => {
    mostrarSugestoes.value = false
  }, 200)
}

function adicionarPeca() {
  pecas.value.push({
    descricao: '',
    valorUnitario: 0,
    quantidade: 1,
    valorTotal: 0
  })
}

function removerPeca(index: number) {
  pecas.value.splice(index, 1)
}

function calcularValorPeca(index: number) {
  const peca = pecas.value[index]
  if (peca) {
    peca.valorTotal = peca.valorUnitario * peca.quantidade
  }
}

function atualizarValorTotal() {
  orcamento.valorTotal = valorTotalGeral.value
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

function imprimirOrcamento() {
  if (!clienteSelecionado.value) {
    alert('Selecione um cliente primeiro!')
    return
  }

  const conteudo = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Orçamento - MF ARCONDICIONADO</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #1c74cb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1c74cb; }
        .cliente-info { margin-bottom: 30px; }
        .pecas-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .pecas-table th, .pecas-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .pecas-table th { background-color: #f8f9fa; }
        .totais { margin-top: 30px; text-align: right; }
        .total-geral { font-size: 18px; font-weight: bold; color: #1c74cb; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">MF ARCONDICIONADO</div>
        <h2>ORÇAMENTO</h2>
        <p>Data: ${new Date(orcamento.data).toLocaleDateString('pt-BR')}</p>
      </div>

      <div class="cliente-info">
        <h3>Dados do Cliente:</h3>
        <p><strong>Nome:</strong> ${getNomePrincipal(clienteSelecionado.value)}</p>
        <p><strong>${clienteSelecionado.value.tipo === 'fisica' ? 'CPF' : 'CNPJ'}:</strong> ${clienteSelecionado.value.tipo === 'fisica' ? clienteSelecionado.value.cpf || 'N/I' : clienteSelecionado.value.cnpj || 'N/I'}</p>
        ${clienteSelecionado.value.celular ? `<p><strong>Telefone:</strong> ${clienteSelecionado.value.celular}</p>` : ''}
        ${clienteSelecionado.value.email ? `<p><strong>E-mail:</strong> ${clienteSelecionado.value.email}</p>` : ''}
      </div>

      ${orcamento.descricao ? `
      <div>
        <h3>Descrição do Serviço:</h3>
        <p>${orcamento.descricao}</p>
      </div>
      ` : ''}

      ${pecas.value.length > 0 ? `
      <div>
        <h3>Peças e Materiais:</h3>
        <table class="pecas-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor Unitário</th>
              <th>Quantidade</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${pecas.value.map(peca => `
              <tr>
                <td>${peca.descricao}</td>
                <td>${formatarMoeda(peca.valorUnitario)}</td>
                <td>${peca.quantidade}</td>
                <td>${formatarMoeda(peca.valorTotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="totais">
        <p><strong>Subtotal Peças:</strong> ${formatarMoeda(subtotalPecas.value)}</p>
        <p><strong>Mão de Obra:</strong> ${formatarMoeda(maoDeObra.value)}</p>
        <p class="total-geral"><strong>TOTAL GERAL:</strong> ${formatarMoeda(valorTotalGeral.value)}</p>
      </div>

      <div class="footer">
        <p>MF ARCONDICIONADO - Especialistas em Climatização</p>
        <p>Este orçamento é válido por 30 dias</p>
      </div>
    </body>
    </html>
  `

  // Salva o conteúdo original da página
  const original = document.body.innerHTML
  document.body.innerHTML = conteudo
  window.print()
  document.body.innerHTML = original
  window.location.reload()
}

async function carregarClientes() {
  const res = await fetch('/api/clientes')
  clientes.value = await res.json()
}

async function salvarOrcamento() {
  if (!orcamento.clienteId) {
    alert('Selecione um cliente!')
    return
  }

  const dados = {
    ...orcamento,
    data: new Date().toISOString(),
    valorTotal: valorTotalGeral.value,
    pecas: pecas.value,
    maoDeObra: maoDeObra.value
  }

  console.log('Dados do orçamento a serem salvos:', dados)

  try {
    const response = await fetch('/api/orcamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
    
    if (response.ok) {
      const resultado = await response.json()
      console.log('Orçamento salvo com sucesso:', resultado)
      
      sucesso.value = true
      setTimeout(() => sucesso.value = false, 3000)
      
        // Limpar formulário
  Object.assign(orcamento, {
    clienteId: null,
    data: new Date().toISOString().split('T')[0],
    valorTotal: null,
    descricao: '',
    observacoes: ''
  })
      
      // Limpar peças e mão de obra
      pecas.value = []
      maoDeObra.value = 0
      clienteSelecionado.value = null
      buscaCliente.value = ''
    } else {
      const errorData = await response.json()
      console.error('Erro ao salvar orçamento:', errorData)
      alert('Erro ao salvar orçamento: ' + (errorData.message || 'Erro desconhecido'))
    }
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error)
    alert('Erro ao salvar orçamento. Tente novamente.')
  }
}

onMounted(carregarClientes)
</script>

<style scoped>
.orcamento-card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 32px #1976d233;
}
.orcamento-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border-radius: 18px 18px 0 0;
  border: none;
}
.orcamento-title {
  color: #fff;
  font-size: 2rem;
  letter-spacing: 1px;
  text-shadow: 0 4px 16px #0002;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.sugestao-item {
  transition: background-color 0.2s ease;
}

.sugestao-item:hover {
  background-color: #f8f9fa;
}

/* Reduzir espaçamento dos inputs */
.form-control, .form-select {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
  background: #fff !important;
  color: #333 !important;
}

/* Reduzir espaçamento dos labels */
.form-label {
  margin-bottom: 0.15rem;
  font-size: 0.8rem;
}

/* Reduzir espaçamento dos títulos das seções */
h5 {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

/* Classes para transição de cor das labels */
.label-empty {
  color: #e53935 !important;
  transition: color 0.3s ease;
}

.label-filled {
  color: #4caf50 !important;
  transition: color 0.3s ease;
}

/* Transição do botão de cadastro */
.btn {
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1c74cb !important;
  border-color: #1c74cb !important;
}

.btn-primary:hover {
  background-color: #1565c0 !important;
  border-color: #1565c0 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(28, 116, 203, 0.3);
}

.btn-success {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

.btn-success:hover {
  background-color: #388e3c !important;
  border-color: #388e3c !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.theme-dark .card, .theme-dark .card-body, .theme-dark .card-title, .theme-dark .card-footer, .theme-dark .card-header {
  color: #fff !important;
}
.theme-dark .card {
  background: #23272b !important;
  border-color: #444 !important;
}
.theme-dark .card-header {
  background: linear-gradient(135deg, #23272b 0%, #343a40 100%) !important;
  color: #fff !important;
}
.theme-dark .btn-outline-primary {
  color: #fff !important;
  border-color: #1976d2 !important;
}
.theme-dark .btn-outline-primary:hover {
  background: #1976d2 !important;
  color: #fff !important;
}
.theme-dark .btn-outline-danger {
  color: #fff !important;
  border-color: #e53935 !important;
}
.theme-dark .btn-outline-danger:hover {
  background: #e53935 !important;
  color: #fff !important;
}
.theme-dark .text-muted, .theme-dark small.text-muted {
  color: #b0b0b0 !important;
}
</style> 