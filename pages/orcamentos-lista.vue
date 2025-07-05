<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="card shadow-lg border-0 estoque-card" style="max-width: 900px; width: 100%; margin: 0 auto;">
      <div class="card-header text-center py-2 estoque-header">
        <h3 class="text-white fw-bold mb-0 estoque-title">
          <i class="bi bi-list-ul me-2"></i>
          Lista de Orçamentos Realizados
        </h3>
      </div>
      <div class="card-body p-3">
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">Mês</label>
            <select v-model="filtroMes" class="form-select">
              <option v-for="(mes, idx) in meses" :key="idx" :value="idx">{{ mes }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Ano</label>
            <select v-model="filtroAno" class="form-select">
              <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
            </select>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <div class="fw-bold ms-auto">Total do mês: <span class="text-primary">R$ {{ totalMensal.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}</span></div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead class="table-primary">
              <tr>
                <th @click="ordenarPor('data')" style="cursor:pointer; user-select:none;">
                  Data/Hora
                  <span v-if="ordenacao.campo === 'data'">
                    <i :class="ordenacao.direcao === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'" style="font-size:0.9em;"></i>
                  </span>
                </th>
                <th @click="ordenarPor('cliente')" style="cursor:pointer; user-select:none;">
                  Cliente
                  <span v-if="ordenacao.campo === 'cliente'">
                    <i :class="ordenacao.direcao === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'" style="font-size:0.9em;"></i>
                  </span>
                </th>
                <th>Descrição</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="orcamento in orcamentosMensais" :key="orcamento.id" @click="abrirDetalhes(orcamento)" style="cursor:pointer;">
                <td>{{ formatarData(orcamento.data) }}</td>
                <td>{{ getNomeCliente(orcamento) }}</td>
                <td>{{ orcamento.descricao || '-' }}</td>
                <td>{{ formatarValor(orcamento.valorTotal) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-secondary fw-bold">
                <td colspan="3" class="text-end">Total Geral:</td>
                <td>{{ formatarValor(totalGeral) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Orçamento -->
    <div v-if="orcamentoSelecionado" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-file-earmark-text me-2"></i>
              Detalhes do Orçamento
            </h5>
            <button type="button" class="btn-close" @click="fecharDetalhes"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2"><b>Data:</b> {{ formatarData(orcamentoSelecionado.data) }}</div>
            <div class="mb-2"><b>Cliente:</b> {{ getNomeCliente(orcamentoSelecionado) }}</div>
            <div class="mb-2"><b>Descrição:</b> {{ orcamentoSelecionado.descricao || '-' }}</div>
            <div class="mb-2"><b>Mão de Obra:</b> R$ {{ formatarValor(orcamentoSelecionado.maoDeObra || 0) }}</div>
            <div class="mb-2"><b>Observações:</b> {{ orcamentoSelecionado.observacoes || '-' }}</div>
            <div class="mb-2"><b>Valor Total:</b> R$ {{ formatarValor(orcamentoSelecionado.valorTotal) }}</div>
            <div class="mb-2"><b>ID:</b> {{ orcamentoSelecionado.id }}</div>
            <div v-if="orcamentoSelecionado.pecas && orcamentoSelecionado.pecas.length">
              <hr />
              <b>Peças:</b>
              <table class="table table-sm mt-2">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor Unitário (R$)</th>
                    <th>Quantidade</th>
                    <th>Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(peca, idx) in orcamentoSelecionado.pecas" :key="idx">
                    <td>{{ peca.descricao }}</td>
                    <td>{{ formatarValor(peca.valorUnitario) }}</td>
                    <td>{{ peca.quantidade }}</td>
                    <td>{{ formatarValor(peca.valorUnitario * peca.quantidade) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger me-auto" @click="mostrarConfirmacao = true">Apagar</button>
            <button class="btn btn-secondary" @click="fecharDetalhes">Fechar</button>
            <button class="btn btn-primary" @click="imprimirOrcamento">Imprimir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Template de impressão oculto -->
    <template v-if="orcamentoSelecionado">
      <div id="print-area" style="display:none;">
        <div class="orcamento-print-card" style="max-width:700px;margin:0 auto;padding:32px 32px 24px 32px;border-radius:18px;background:#fff;box-shadow:0 8px 32px #1976d233;">
          <div class="orcamento-print-header" style="background:linear-gradient(135deg,#6c757d 0%,#495057 100%);border-radius:18px 18px 0 0;padding:16px 0 12px 0;text-align:center;">
            <h2 style="color:#fff;font-size:2rem;letter-spacing:1px;text-shadow:0 4px 16px #0002;margin:0;">
              <i class="bi bi-currency-dollar me-2"></i>Orçamento
            </h2>
          </div>
          <div style="padding:24px 0 0 0;">
            <div style="margin-bottom:10px;"><b>Data:</b> {{ formatarData(orcamentoSelecionado.data) }}</div>
            <div style="margin-bottom:10px;"><b>Cliente:</b> {{ getNomeCliente(orcamentoSelecionado) }}</div>
            <div style="margin-bottom:10px;"><b>Descrição:</b> {{ orcamentoSelecionado.descricao || '-' }}</div>
            <div style="margin-bottom:10px;"><b>Mão de Obra:</b> R$ {{ formatarValor(orcamentoSelecionado.maoDeObra || 0) }}</div>
            <div style="margin-bottom:10px;"><b>Observações:</b> {{ orcamentoSelecionado.observacoes || '-' }}</div>
            <div style="margin-bottom:10px;"><b>Valor Total:</b> R$ {{ formatarValor(orcamentoSelecionado.valorTotal) }}</div>
            <div style="margin-bottom:10px;"><b>ID:</b> {{ orcamentoSelecionado.id }}</div>
            <div v-if="orcamentoSelecionado.pecas && orcamentoSelecionado.pecas.length">
              <hr />
              <b>Peças:</b>
              <table class="table table-sm mt-2">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor Unitário (R$)</th>
                    <th>Quantidade</th>
                    <th>Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(peca, idx) in orcamentoSelecionado.pecas" :key="idx">
                    <td>{{ peca.descricao }}</td>
                    <td>{{ formatarValor(peca.valorUnitario) }}</td>
                    <td>{{ peca.quantidade }}</td>
                    <td>{{ formatarValor(peca.valorUnitario * peca.quantidade) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style="margin-top:32px;text-align:center;">
            <span style="font-size:1.1rem;color:#888;">MF ARCONDICIONADO</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de confirmação de exclusão -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

interface Cliente {
  id: number
  nomeCompleto?: string
  razaoSocial?: string
  nomeFantasia?: string
  tipo?: string
}

interface Orcamento {
  id: number
  data: string
  descricao?: string
  valorTotal: number
  responsavel?: string
  cliente?: Cliente
  pecas?: Peca[]
  maoDeObra?: number
  observacoes?: string
}

interface Peca {
  descricao: string
  valorUnitario: number
  quantidade: number
}

const orcamentos = ref<Orcamento[]>([])
const totalGeral = ref(0)
const orcamentoSelecionado = ref<Orcamento|null>(null)
const orcamentoCompleto = ref<any>(null)
const ordenacao = ref({ campo: 'data', direcao: 'desc' })
const mostrarConfirmacao = ref(false)
const carregandoExclusao = ref(false)

// Filtro de mês/ano
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]
const anoAtual = new Date().getFullYear()
const anos = Array.from(new Set(orcamentos.value.map(o => new Date(o.data).getFullYear()))).sort((a, b) => b - a)
const filtroMes = ref(new Date().getMonth())
const filtroAno = ref(anoAtual)

const orcamentosMensais = computed(() => {
  return orcamentosOrdenados.value.filter(o => {
    const d = new Date(o.data)
    return d.getMonth() === filtroMes.value && d.getFullYear() === filtroAno.value
  })
})
const totalMensal = computed(() => {
  return orcamentosMensais.value.reduce((soma, o) => soma + (o.valorTotal || 0), 0)
})

// Atualizar anos disponíveis quando carregar orçamentos
watch(orcamentos, (novos) => {
  const anosUnicos = Array.from(new Set(novos.map(o => new Date(o.data).getFullYear())))
  anos.splice(0, anos.length, ...anosUnicos.sort((a, b) => b - a))
})

function formatarData(data: string) {
  if (!data) return '-';
  const d = new Date(data);
  const dataStr = d.toLocaleDateString('pt-BR');
  const horaStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataStr} ${horaStr}`;
}
function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
function getNomeCliente(orcamento: Orcamento) {
  if (!orcamento.cliente) return '-'
  if (orcamento.cliente.tipo === 'fisica') {
    return orcamento.cliente.nomeCompleto || '-'
  } else {
    return orcamento.cliente.razaoSocial || orcamento.cliente.nomeFantasia || '-'
  }
}

async function abrirDetalhes(orcamento: Orcamento) {
  // Busca detalhes completos do orçamento
  const res = await fetch(`/api/orcamentos/${orcamento.id}`)
  if (res.ok) {
    const data = await res.json()
    orcamentoCompleto.value = data
    orcamentoSelecionado.value = {
      ...orcamento,
      pecas: data.pecas ? JSON.parse(data.pecas) : [],
      maoDeObra: data.maoDeObra || 0,
      observacoes: data.observacoes || ''
    }
  } else {
    orcamentoCompleto.value = null
    orcamentoSelecionado.value = orcamento
  }
  document.body.classList.add('modal-open')
}
function fecharDetalhes() {
  orcamentoSelecionado.value = null
  document.body.classList.remove('modal-open')
}
function imprimirOrcamento() {
  if (!orcamentoSelecionado.value) return;
  const orc = orcamentoSelecionado.value;
  const cliente = orc.cliente || {};
  const pecas = orc.pecas || [];
  const dataHoje = new Date();
  const dataFormatada = dataHoje.toLocaleDateString('pt-BR') + ', ' + dataHoje.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dataOrcamento = orc.data ? new Date(orc.data).toLocaleDateString('pt-BR') : '-';
  const subtotalPecas = pecas.reduce((soma, p) => soma + (p.valorUnitario * p.quantidade), 0);
  const maoDeObra = orc.maoDeObra || 0;
  const totalGeral = subtotalPecas + maoDeObra;
  const printContent = `
    <html>
    <head>
      <title>Orçamento - MF ARCONDICIONADO</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
        body { background: #fff; color: #222; font-family: Arial, sans-serif; }
        .orc-print-header { text-align: center; margin-bottom: 16px; }
        .orc-print-header h2 { color: #1976d2; font-weight: bold; margin-bottom: 0; }
        .orc-print-header h1 { color: #222; font-weight: bold; margin-top: 0; letter-spacing: 1px; }
        .orc-print-header .data { margin-top: 8px; font-size: 1.1rem; }
        .orc-print-divider { border-top: 3px solid #1976d2; margin: 18px 0 18px 0; }
        .orc-print-section-title { font-size: 1.3rem; font-weight: bold; margin-bottom: 8px; }
        .orc-print-table th, .orc-print-table td { text-align: center; vertical-align: middle; }
        .orc-print-table th { background: #f8f9fa; }
        .orc-print-table { margin-bottom: 0; }
        .orc-print-totais { text-align: right; margin-top: 12px; }
        .orc-print-totais strong { color: #1976d2; font-size: 1.1rem; }
        .orc-print-footer { margin-top: 40px; text-align: center; color: #888; font-size: 1rem; }
        .orc-print-validade { margin-top: 8px; color: #888; font-size: 0.95rem; }
        @media print { .orc-print-header { page-break-before: avoid; } }
      </style>
    </head>
    <body>
      <div style="padding: 32px 24px 24px 24px; max-width: 800px; margin: 0 auto; background: #fff; border-radius: 18px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #444;">
          <span>${dataFormatada}</span>
          <span>Orçamento - MF ARCONDICIONADO</span>
        </div>
        <div class="orc-print-header">
          <h2>MF ARCONDICIONADO</h2>
          <h1>ORÇAMENTO</h1>
          <div class="data">Data: ${dataOrcamento}</div>
        </div>
        <div class="orc-print-divider"></div>
        <div class="orc-print-section-title">Dados do Cliente:</div>
        <div style="margin-bottom: 12px;">
          <b>Nome:</b> ${(cliente as any)?.nomeCompleto || (cliente as any)?.razaoSocial || (cliente as any)?.nomeFantasia || '-'}<br/>
          <b>CPF:</b> ${(cliente as any)?.cpf || '-'}<br/>
          <b>Telefone:</b> ${(cliente as any)?.telefone || '-'}
        </div>
        <div class="orc-print-section-title">Peças e Materiais:</div>
        <table class="table table-bordered orc-print-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor Unitário</th>
              <th>Quantidade</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${pecas.length ? pecas.map(p => `
              <tr>
                <td>${p.descricao || '-'}</td>
                <td>R$ ${Number(p.valorUnitario).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
                <td>${p.quantidade}</td>
                <td>R$ ${(p.valorUnitario * p.quantidade).toLocaleString('pt-BR', {minimumFractionDigits:2})}</td>
              </tr>
            `).join('') : '<tr><td colspan="4">Nenhuma peça informada</td></tr>'}
          </tbody>
        </table>
        <div class="orc-print-totais">
          Subtotal Peças: R$ ${subtotalPecas.toLocaleString('pt-BR', {minimumFractionDigits:2})}<br/>
          Mão de Obra: R$ ${maoDeObra.toLocaleString('pt-BR', {minimumFractionDigits:2})}<br/>
          <strong>TOTAL GERAL: R$ ${totalGeral.toLocaleString('pt-BR', {minimumFractionDigits:2})}</strong>
        </div>
        <div class="orc-print-footer">
          MF ARCONDICIONADO - Especialistas em Climatização
          <div class="orc-print-validade">Este orçamento é válido por 30 dias</div>
        </div>
      </div>
    </body>
    </html>
  `;
  const win = window.open('', '', 'width=900,height=700');
  win?.document.write(printContent);
  win?.document.close();
  win?.focus();
  setTimeout(() => { win?.print(); win?.close(); }, 500);
}

function ordenarPor(campo: string) {
  if (ordenacao.value.campo === campo) {
    ordenacao.value.direcao = ordenacao.value.direcao === 'asc' ? 'desc' : 'asc'
  } else {
    ordenacao.value.campo = campo
    ordenacao.value.direcao = campo === 'data' ? 'desc' : 'asc'
  }
}

const orcamentosOrdenados = computed(() => {
  const lista = [...orcamentos.value]
  if (ordenacao.value.campo === 'data') {
    lista.sort((a, b) => {
      const tA = new Date(a.data).getTime()
      const tB = new Date(b.data).getTime()
      return ordenacao.value.direcao === 'asc' ? tA - tB : tB - tA
    })
  } else if (ordenacao.value.campo === 'cliente') {
    lista.sort((a, b) => {
      const nomeA = getNomeCliente(a).toLowerCase()
      const nomeB = getNomeCliente(b).toLowerCase()
      if (nomeA < nomeB) return ordenacao.value.direcao === 'asc' ? -1 : 1
      if (nomeA > nomeB) return ordenacao.value.direcao === 'asc' ? 1 : -1
      return 0
    })
  }
  return lista
})

onMounted(async () => {
  const res = await fetch('/api/orcamentos')
  if (res.ok) {
    const lista = await res.json()
    orcamentos.value = lista.sort((a: Orcamento, b: Orcamento) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime()
    })
    totalGeral.value = lista.reduce((soma: number, o: Orcamento) => soma + (o.valorTotal || 0), 0)
  }
})

async function apagarOrcamento() {
  if (!orcamentoSelecionado.value) return
  carregandoExclusao.value = true
  try {
    const res = await fetch(`/api/orcamentos/${orcamentoSelecionado.value.id}`, { method: 'DELETE' })
    if (res.ok) {
      // Remove da lista
      orcamentos.value = orcamentos.value.filter(o => o.id !== orcamentoSelecionado.value?.id)
      totalGeral.value = orcamentos.value.reduce((soma, o) => soma + (o.valorTotal || 0), 0)
      mostrarConfirmacao.value = false
      fecharDetalhes()
    } else {
      alert('Erro ao apagar orçamento!')
    }
  } catch (e) {
    alert('Erro ao apagar orçamento!')
  }
  carregandoExclusao.value = false
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
.estoque-card {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 32px #1976d233;
}
.estoque-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border-radius: 18px 18px 0 0;
  border: none;
}
.estoque-title {
  color: #fff;
  font-size: 2rem;
  letter-spacing: 1px;
  text-shadow: 0 4px 16px #0002;
}
.table-primary {
  background-color: #f8f9fa !important;
  color: #495057 !important;
  font-weight: bold;
}
.theme-dark .estoque-card {
  background: #23272b !important;
  color: #f8f9fa !important;
  box-shadow: 0 8px 32px #0008;
}
.theme-dark .estoque-header {
  background: linear-gradient(135deg, #23272b 0%, #343a40 100%) !important;
  color: #f8f9fa !important;
}
.theme-dark .table {
  background: #23272b !important;
  color: #f8f9fa !important;
}
.theme-dark .table th, .theme-dark .table td {
  background: #23272b !important;
  color: #f8f9fa !important;
  border-color: #444 !important;
}
.theme-dark .table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #181a1b !important;
}
.theme-dark .table-hover > tbody > tr:hover {
  background-color: #333 !important;
}
.theme-dark .modal-content {
  background: #23272b !important;
  color: #f8f9fa !important;
  border-color: #444 !important;
}
.theme-dark .modal-header {
  background: linear-gradient(135deg, #23272b 0%, #343a40 100%) !important;
  color: #f8f9fa !important;
  border-bottom: 1px solid #444 !important;
}
.theme-dark .modal-footer {
  border-top: 1px solid #444 !important;
}
.theme-dark .dropdown-menu {
  background: #23272b !important;
  color: #f8f9fa !important;
  border-color: #444 !important;
}
.theme-dark .dropdown-item {
  color: #f8f9fa !important;
}
.theme-dark .dropdown-item:hover {
  background: #333 !important;
  color: #fff !important;
}
</style> 