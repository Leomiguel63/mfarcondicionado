<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="card shadow-lg border-0 orcamento-card" style="max-width: 900px; width: 100%; margin: 0 auto;">
      <div class="card-header text-center py-2 orcamento-header">
        <h3 class="text-white fw-bold mb-0 orcamento-title">
          <i class="bi bi-currency-dollar me-2"></i>
          Editar Orçamento
        </h3>
      </div>
      <div class="card-body p-2">
        <form @submit.prevent="salvarEdicao">
          <div class="row mb-3">
            <div class="col-md-6 mb-2">
              <label class="form-label fw-bold">
                <i class="bi bi-calendar me-1"></i>Data do Orçamento
              </label>
              <input v-model="orcamento.data" type="date" class="form-control" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label fw-bold">
                <i class="bi bi-person me-1"></i>Cliente ID
              </label>
              <input v-model="orcamento.clienteId" type="number" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 mb-2">
              <label class="form-label fw-bold">
                <i class="bi bi-chat-left-text me-1"></i>Descrição
              </label>
              <textarea v-model="orcamento.descricao" class="form-control" rows="2"></textarea>
            </div>
            <div class="col-12 mb-2">
              <label class="form-label fw-bold">
                <i class="bi bi-chat-left-text me-1"></i>Observações
              </label>
              <textarea v-model="orcamento.observacoes" class="form-control" rows="2"></textarea>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 mb-2">
              <label class="form-label fw-bold">
                <i class="bi bi-person-workspace me-1"></i>Mão de Obra (R$)
              </label>
              <input v-model.number="orcamento.maoDeObra" type="number" min="0" step="0.01" class="form-control" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label fw-bold">
                <i class="bi bi-calculator me-1"></i>Valor Total (R$)
              </label>
              <input :value="formatarMoeda(valorTotalGeral)" type="text" class="form-control" readonly />
            </div>
          </div>
          <div class="mb-3">
            <h5 class="fw-bold mb-2" style="color: #6c757d;">
              <i class="bi bi-puzzle-piece me-2"></i>Peças
            </h5>
            <div v-for="(peca, index) in pecas" :key="index" class="card mb-2 border-0" style="background-color: #f8f9fa;">
              <div class="card-body p-3">
                <div class="row align-items-center">
                  <div class="col-md-5">
                    <label class="form-label fw-bold small mb-1">
                      <i class="bi bi-tag me-1"></i>Descrição da Peça
                    </label>
                    <input v-model="peca.descricao" type="text" class="form-control form-control-sm" />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label fw-bold small mb-1">
                      <i class="bi bi-currency-dollar me-1"></i>Valor Unitário (R$)
                    </label>
                    <input v-model.number="peca.valorUnitario" type="number" step="0.01" min="0" class="form-control form-control-sm" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label fw-bold small mb-1">
                      <i class="bi bi-hash me-1"></i>Quantidade
                    </label>
                    <input v-model.number="peca.quantidade" type="number" min="1" class="form-control form-control-sm" />
                  </div>
                  <div class="col-md-2">
                    <label class="form-label fw-bold small mb-1">
                      <i class="bi bi-calculator me-1"></i>Total (R$)
                    </label>
                    <input :value="formatarMoeda(peca.valorUnitario * peca.quantidade)" type="text" class="form-control form-control-sm" readonly />
                  </div>
                  <div class="col-12 mt-2 text-end">
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removerPeca(index)">
                      <i class="bi bi-trash me-1"></i>Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <button type="button" class="btn btn-outline-primary btn-sm" @click="adicionarPeca">
                <i class="bi bi-plus-circle me-1"></i>Adicionar Peça
              </button>
            </div>
          </div>
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary fw-bold flex-fill">
              <i class="bi bi-check-circle me-2"></i>
              Salvar Alterações
            </button>
            <button type="button" class="btn btn-secondary fw-bold" @click="voltar">
              <i class="bi bi-arrow-left me-2"></i>
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Peca {
  descricao: string
  valorUnitario: number
  quantidade: number
  valorTotal: number
}

const orcamento = reactive({
  clienteId: null,
  data: '',
  valorTotal: 0,
  descricao: '',
  observacoes: '',
  maoDeObra: 0
})
const pecas = ref<Peca[]>([])

onMounted(async () => {
  const id = route.params.id
  if (id) {
    // Simulação de fetch, troque por API real se necessário
    const res = await fetch(`/api/orcamentos/${id}`)
    if (res.ok) {
      const data = await res.json()
      orcamento.clienteId = data.clienteId
      orcamento.data = data.data?.split('T')[0] || ''
      orcamento.valorTotal = data.valorTotal
      orcamento.descricao = data.descricao || ''
      orcamento.observacoes = data.observacoes || ''
      orcamento.maoDeObra = data.maoDeObra || 0
      pecas.value = data.pecas ? JSON.parse(data.pecas) : []
    }
  }
})

function adicionarPeca() {
  pecas.value.push({ descricao: '', valorUnitario: 0, quantidade: 1, valorTotal: 0 })
}
function removerPeca(index: number) {
  pecas.value.splice(index, 1)
}
const valorTotalGeral = computed(() => {
  const subtotal = pecas.value.reduce((total, p) => total + (p.valorUnitario * p.quantidade), 0)
  return subtotal + (orcamento.maoDeObra || 0)
})
function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}
function voltar() {
  router.back()
}
function salvarEdicao() {
  const id = route.params.id
  fetch(`/api/orcamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...orcamento,
      pecas: JSON.stringify(pecas.value),
      valorTotal: valorTotalGeral.value
    })
  })
    .then(res => {
      if (res.ok) {
        alert('Alterações salvas com sucesso!')
        voltar()
      } else {
        alert('Erro ao salvar alterações!')
      }
    })
    .catch(() => {
      alert('Erro ao salvar alterações!')
    })
}
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
</style>
<style scoped>
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