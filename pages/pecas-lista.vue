<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="container">
      <div class="card shadow-lg border-0 estoque-card">
        <div class="card-header text-center py-2 estoque-header">
          <h3 class="text-white fw-bold mb-0 estoque-title">
            <i class="bi bi-boxes me-2"></i>
            Listagem de Estoque
          </h3>
        </div>
        <div class="card-body p-2">
          <div class="row mb-4">
            <div class="col-md-6 mx-auto">
              <div class="input-group input-group-lg">
                <span class="input-group-text" style="background: #1976d2; border-color: #1976d2; color: white;">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  v-model="busca" 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por nome ou código..."
                />
              </div>
            </div>
          </div>
          <div class="row g-3">
            <div v-for="peca in pecasFiltradas" :key="peca.id" class="col-md-6 col-lg-4">
              <div class="card h-100 border-0 shadow-sm" style="transition: all 0.3s ease;">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-puzzle-piece" style="font-size: 2rem; color: #1976d2;"></i>
                    <div class="ms-3">
                      <h6 class="card-title fw-bold mb-1" style="color: #1976d2;">{{ peca.nome }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-upc-scan me-1"></i>
                        {{ peca.codigo }}
                      </small>
                    </div>
                  </div>
                  <div class="row text-center">
                    <div class="col-6">
                      <div class="border-end">
                        <h6 class="fw-bold text-success mb-1">
                          <i class="bi bi-boxes me-1"></i>
                          {{ peca.quantidade }}
                        </h6>
                        <small class="text-muted">Quantidade</small>
                      </div>
                    </div>
                    <div class="col-6">
                      <h6 class="fw-bold text-primary mb-1">
                        <i class="bi bi-currency-dollar me-1"></i>
                        R$ {{ (peca.valor || 0).toFixed(2) }}
                      </h6>
                      <small class="text-muted">Valor Unit.</small>
                    </div>
                  </div>
                </div>
                <div class="card-footer bg-transparent border-0 text-center">
                  <button class="btn btn-outline-primary btn-sm me-2">
                    <i class="bi bi-eye me-1"></i>Ver
                  </button>
                  <button class="btn btn-outline-warning btn-sm me-2" @click="abrirModalEditar(peca)">
                    <i class="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="peca.id !== undefined && pedirConfirmacaoDelete(peca.id)">
                    <i class="bi bi-trash me-1"></i>Apagar
                  </button>
                </div>
              </div>
            </div>
            <div v-if="pecasFiltradas.length === 0" class="col-12">
              <div class="text-center py-5">
                <i class="bi bi-boxes" style="font-size: 4rem; color: #e53935; opacity: 0.5;"></i>
                <h4 class="mt-3 fw-bold" style="color: #e53935;">Nenhuma peça encontrada</h4>
                <p class="text-muted">Tente ajustar sua busca ou cadastre uma nova peça.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template v-if="showModal">
    <div class="modal fade show d-block" tabindex="-1" style="background: #0008;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Peça</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Quantidade</label>
              <input type="number" class="form-control" v-model.number="editPeca.quantidade" min="0" />
            </div>
            <div class="mb-3">
              <label class="form-label">Valor Unitário (R$)</label>
              <input type="number" class="form-control" v-model.number="editPeca.valor" min="0" step="0.01" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="salvarEdicao">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-if="showDeleteModal">
    <div class="modal fade show d-block" tabindex="-1" style="background: #0008;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja apagar esta peça do estoque?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn btn-danger" @click="confirmarDelete">Apagar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'

interface Peca {
  id?: number
  nome?: string
  codigo?: string
  quantidade?: number
  valor?: number
}

const pecas = ref<Peca[]>([])

const busca = ref('')

const showModal = ref(false)
const editPeca = reactive<Peca>({})

const showDeleteModal = ref(false)
const idParaDeletar = ref<number|null>(null)

const pecasFiltradas = computed(() => {
  if (!busca.value) return pecas.value
  const termo = busca.value.toLowerCase()
  return pecas.value.filter(peca => 
    peca.nome?.toLowerCase().includes(termo) || 
    peca.codigo?.toLowerCase().includes(termo)
  )
})

function abrirModalEditar(peca: Peca) {
  Object.assign(editPeca, peca)
  showModal.value = true
}

async function salvarEdicao() {
  try {
    const res = await fetch('/api/pecas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editPeca.id,
        quantidade: editPeca.quantidade,
        valor: editPeca.valor
      })
    })
    if (res.ok) {
      const atualizada = await res.json()
      const idx = pecas.value.findIndex(p => p.id === atualizada.id)
      if (idx !== -1) pecas.value[idx] = atualizada
      showModal.value = false
    }
  } catch (e) {}
}

function pedirConfirmacaoDelete(id: number) {
  idParaDeletar.value = id
  showDeleteModal.value = true
}

async function confirmarDelete() {
  if (idParaDeletar.value === null) return
  const id = idParaDeletar.value
  try {
    const res = await fetch('/api/pecas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      pecas.value = pecas.value.filter(p => p.id !== id)
    }
  } finally {
    showDeleteModal.value = false
    idParaDeletar.value = null
  }
}

onMounted(async () => {
  try {
    const res = await fetch('/api/pecas')
    if (res.ok) {
      pecas.value = await res.json()
    }
  } catch (e) {
    // erro ao buscar peças
  }
})
</script>

<style scoped>
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
</style> 