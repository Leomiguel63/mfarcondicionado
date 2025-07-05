<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="card shadow-lg border-0" style="max-width: 1100px; width: 100%; margin: 0 auto;">
      <div class="card-header text-center py-2" style="background: linear-gradient(135deg, #1c74cb 0%, #1565c0 100%); border: none;">
        <h3 class="text-white fw-bold mb-0">
          <i class="bi bi-clock-history me-2"></i>
          Histórico Geral de Orçamentos
        </h3>
      </div>
      <div class="card-body p-3">
        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary">
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor (R$)</th>
                <th>Saldo Acumulado (R$)</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(orcamento, idx) in orcamentos" :key="orcamento.id">
                <td>{{ formatarData(orcamento.data) }}</td>
                <td>{{ orcamento.descricao || '-' }}</td>
                <td>{{ orcamento.tipo || 'Orçamento' }}</td>
                <td>{{ formatarValor(orcamento.valorTotal) }}</td>
                <td>{{ formatarValor(saldos[idx]) }}</td>
                <td>
                  <span class="d-block mb-1">{{ orcamento.responsavel || 'Não informado' }}</span>
                  <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" @click="verCompleto(orcamento)" title="Ver Completo">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-info" @click="imprimirOrcamento(orcamento)" title="Imprimir">
                      <i class="bi bi-printer"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="abrirModalExcluir(orcamento)" title="Apagar">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-secondary fw-bold">
                <td colspan="3" class="text-end">Total Geral:</td>
                <td>{{ formatarValor(totalGeral) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div v-if="sucesso" class="alert alert-success text-center fw-bold mt-3" role="alert">
    Orçamento apagado com sucesso!
  </div>

  <div v-if="mostrarConfirmacao" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title fw-bold">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Confirmar Exclusão
          </h5>
          <button type="button" class="btn-close" @click="mostrarConfirmacao = false"></button>
        </div>
        <div class="modal-body">
          Tem certeza que deseja apagar este orçamento? Esta ação não pode ser desfeita.
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="mostrarConfirmacao = false" :disabled="carregandoExclusao">Cancelar</button>
          <button class="btn btn-danger" @click="apagarOrcamento" :disabled="carregandoExclusao">
            <span v-if="carregandoExclusao" class="spinner-border spinner-border-sm me-2"></span>
            Apagar
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="mostrarModalDetalhes" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold">
            <i class="bi bi-eye me-2"></i>
            Detalhes do Orçamento
          </h5>
          <button type="button" class="btn-close" @click="mostrarModalDetalhes = false"></button>
        </div>
        <div class="modal-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
              <thead class="table-primary">
                <tr>
                  <th>Descrição</th>
                  <th>Valor Unitário</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(peca, idx) in orcamentoDetalhado.pecas" :key="idx">
                  <td>{{ peca.descricao }}</td>
                  <td>{{ formatarValor(peca.valorUnitario) }}</td>
                  <td>{{ peca.quantidade }}</td>
                  <td>{{ formatarValor(peca.valorTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="mostrarModalDetalhes = false">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Orcamento {
  id: number
  data: string
  descricao?: string
  tipo?: string
  valorTotal: number
  responsavel?: string
}

const router = useRouter()

const orcamentos = ref<Orcamento[]>([])
const saldos = ref<number[]>([])
const totalGeral = ref(0)
const orcamentoSelecionado = ref<Orcamento | null>(null)
const mostrarConfirmacao = ref(false)
const sucesso = ref(false)
const carregandoExclusao = ref(false)
const mostrarModalDetalhes = ref(false)
const orcamentoDetalhado = ref<any>(null)

function formatarData(data: string) {
  if (!data) return '-'
  return new Date(data).toLocaleDateString('pt-BR')
}
function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

onMounted(async () => {
  const res = await fetch('/api/orcamentos')
  if (res.ok) {
    const lista = await res.json()
    // Ordenar por data crescente
    lista.sort((a: Orcamento, b: Orcamento) => new Date(a.data).getTime() - new Date(b.data).getTime())
    orcamentos.value = lista
    // Calcular saldo acumulado
    let saldo = 0
    saldos.value = lista.map((o: Orcamento) => {
      saldo += o.valorTotal || 0
      return saldo
    })
    totalGeral.value = saldo
  }
})

function verCompleto(orcamento: Orcamento) {
  console.log('Ver completo:', orcamento)
  // Buscar detalhes completos do orçamento
  fetch(`/api/orcamentos/${orcamento.id}`)
    .then(res => res.json())
    .then(data => {
      let pecas = []
      if (data.pecas) {
        try {
          pecas = JSON.parse(data.pecas)
        } catch (e) {
          pecas = []
        }
      }
      orcamentoDetalhado.value = { ...data, pecas }
      mostrarModalDetalhes.value = true
    })
}

function editarOrcamento(id: number) {
  console.log('Editar orçamento:', id)
  router.push(`/orcamento/${id}`)
}

function abrirModalExcluir(orcamento: Orcamento) {
  console.log('Abrir modal excluir:', orcamento)
  orcamentoSelecionado.value = orcamento
  mostrarConfirmacao.value = true
}

async function apagarOrcamento() {
  if (!orcamentoSelecionado.value) return
  carregandoExclusao.value = true
  try {
    console.log('Apagar orçamento:', orcamentoSelecionado.value.id)
    const res = await fetch(`/api/orcamentos/${orcamentoSelecionado.value.id}`, { method: 'DELETE' })
    if (res.ok) {
      // Remove da lista
      const idx = orcamentos.value.findIndex(o => o.id === orcamentoSelecionado.value?.id)
      if (idx !== -1) {
        orcamentos.value.splice(idx, 1)
        // Recalcular saldos
        let saldo = 0
        saldos.value = orcamentos.value.map((o: Orcamento) => {
          saldo += o.valorTotal || 0
          return saldo
        })
        totalGeral.value = saldo
      }
      sucesso.value = true
      setTimeout(() => sucesso.value = false, 2500)
      mostrarConfirmacao.value = false
    } else {
      alert('Erro ao apagar orçamento!')
    }
  } catch (e) {
    alert('Erro ao apagar orçamento!')
  }
  carregandoExclusao.value = false
  orcamentoSelecionado.value = null
}

async function imprimirOrcamento(orcamento: Orcamento) {
  try {
    console.log('Imprimir orçamento:', orcamento.id)
    // Buscar dados completos do orçamento
    const response = await fetch(`/api/orcamentos/${orcamento.id}`)
    if (!response.ok) {
      alert('Erro ao buscar dados do orçamento (API orcamentos)')
      console.error('Erro ao buscar orçamento:', response.status, response.statusText)
      return
    }
    
    const orcamentoCompleto = await response.json()
    console.log('Orçamento completo:', orcamentoCompleto)
    if (!orcamentoCompleto.clienteId) {
      alert('Orçamento não possui clienteId!')
      console.error('Orçamento retornado sem clienteId:', orcamentoCompleto)
      return
    }
    // Buscar dados do cliente
    const responseCliente = await fetch(`/api/clientes/${orcamentoCompleto.clienteId}`)
    if (!responseCliente.ok) {
      alert('Erro ao buscar dados do cliente (API clientes)')
      console.error('Erro ao buscar cliente:', responseCliente.status, responseCliente.statusText)
      return
    }
    
    const cliente = await responseCliente.json()
    console.log('Cliente:', cliente)
    // Parsear peças se existirem
    let pecas = []
    if (orcamentoCompleto.pecas) {
      try {
        pecas = JSON.parse(orcamentoCompleto.pecas)
      } catch (e) {
        console.error('Erro ao parsear peças:', e)
      }
    }
    // Calcular subtotal das peças
    const subtotalPecas = pecas.reduce((total: number, peca: any) => total + peca.valorTotal, 0)
    // Função para formatar moeda
    const formatarMoeda = (valor: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor)
    }
    // Função para obter nome principal do cliente
    const getNomePrincipal = (cliente: any): string => {
      if (cliente.tipo === 'fisica') {
        return cliente.nomeCompleto || 'Nome não informado'
      } else {
        return cliente.razaoSocial || cliente.nomeFantasia || 'Razão social não informada'
      }
    }
    const conteudo = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Orçamento #${orcamentoCompleto.id} - MF ARCONDICIONADO</title>
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
          <h2>ORÇAMENTO #${orcamentoCompleto.id}</h2>
          <p>Data: ${new Date(orcamentoCompleto.data).toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="cliente-info">
          <h3>Dados do Cliente:</h3>
          <p><strong>Nome:</strong> ${getNomePrincipal(cliente)}</p>
          <p><strong>${cliente.tipo === 'fisica' ? 'CPF' : 'CNPJ'}:</strong> ${cliente.tipo === 'fisica' ? cliente.cpf || 'N/I' : cliente.cnpj || 'N/I'}</p>
          ${cliente.celular ? `<p><strong>Telefone:</strong> ${cliente.celular}</p>` : ''}
          ${cliente.email ? `<p><strong>E-mail:</strong> ${cliente.email}</p>` : ''}
        </div>
        ${orcamentoCompleto.descricao ? `
        <div>
          <h3>Descrição do Serviço:</h3>
          <p>${orcamentoCompleto.descricao}</p>
        </div>
        ` : ''}
        ${pecas.length > 0 ? `
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
              ${pecas.map((peca: any) => `
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
          <p><strong>Subtotal Peças:</strong> ${formatarMoeda(subtotalPecas)}</p>
          <p><strong>Mão de Obra:</strong> ${formatarMoeda(orcamentoCompleto.maoDeObra)}</p>
          <p class="total-geral"><strong>TOTAL GERAL:</strong> ${formatarMoeda(orcamentoCompleto.valorTotal)}</p>
        </div>
        <div class="footer">
          <p>MF ARCONDICIONADO - Especialistas em Climatização</p>
          <p>Este orçamento é válido por 30 dias</p>
        </div>
      </body>
      </html>
    `
    const janela = window.open('', '_blank')
    if (janela) {
      janela.document.write(conteudo)
      janela.document.close()
      janela.print()
    }
  } catch (error) {
    console.error('Erro ao imprimir orçamento:', error)
    alert('Erro ao gerar impressão do orçamento')
  }
}
</script>

<style scoped>
.table {
  font-size: 1rem;
}
.table th, .table td {
  vertical-align: middle;
}
.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f8f9fa;
}
.table-hover > tbody > tr:hover {
  background-color: #e3f2fd;
}
.card {
  border-radius: 18px;
}
.card-header {
  border-radius: 18px 18px 0 0;
}
</style> 