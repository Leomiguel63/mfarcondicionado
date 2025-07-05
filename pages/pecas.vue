<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="card shadow-lg border-0 estoque-card">
      <div class="card-header text-center py-2 estoque-header">
        <h3 class="text-white fw-bold mb-0 estoque-title">
          <i class="bi bi-puzzle-piece me-2"></i>
          Cadastro de Estoque
        </h3>
      </div>
      <div class="card-body p-2">
        <form @submit.prevent="adicionarPeca">
          <div class="row mb-2">
            <div class="col-md-6 mb-1">
              <label class="form-label fw-bold estoque-label">
                <i class="bi bi-tag me-1"></i>Nome da Peça
              </label>
              <input 
                v-model="novaPeca.nome" 
                type="text" 
                class="form-control form-control-lg" 
                required
              />
            </div>
            <div class="col-md-6 mb-1">
              <label class="form-label fw-bold estoque-label">
                <i class="bi bi-upc-scan me-1"></i>Código
              </label>
              <input 
                v-model="novaPeca.codigo" 
                type="text" 
                class="form-control form-control-lg" 
                required
              />
            </div>
            <div class="col-md-6 mb-1">
              <label class="form-label fw-bold estoque-label">
                <i class="bi bi-boxes me-1"></i>Quantidade
              </label>
              <input 
                v-model.number="novaPeca.quantidade" 
                type="number" 
                min="0"
                class="form-control form-control-lg" 
                required
              />
            </div>
            <div class="col-md-6 mb-1">
              <label class="form-label fw-bold estoque-label">
                <i class="bi bi-currency-dollar me-1"></i>Valor Unitário (R$)
              </label>
              <input 
                v-model.number="novaPeca.valor" 
                type="number" 
                min="0"
                step="0.01"
                class="form-control form-control-lg" 
                required
              />
            </div>
          </div>
          <div class="d-grid gap-2 mt-3">
            <button type="submit" class="btn btn-primary btn-lg fw-bold">
              <i class="bi bi-plus-circle me-2"></i>
              Adicionar Peça
            </button>
          </div>
        </form>
        <div v-if="sucesso" class="alert alert-success text-center fw-bold mt-3" role="alert">
          Produto cadastrado com sucesso!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Peca {
  nome: string
  codigo: string
  quantidade: number
  valor: number
}

const novaPeca = ref<Peca>({ nome: '', codigo: '', quantidade: 0, valor: 0 })
const pecas = ref<Peca[]>([])
const router = useRouter()
const sucesso = ref(false)

async function adicionarPeca() {
  if (!novaPeca.value.nome || !novaPeca.value.codigo) return
  try {
    await fetch('/api/pecas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaPeca.value)
    })
    novaPeca.value = { nome: '', codigo: '', quantidade: 0, valor: 0 }
    sucesso.value = true
    setTimeout(() => sucesso.value = false, 2500)
  } catch (e) {
    alert('Erro ao cadastrar peça!')
  }
}
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
.estoque-label {
  color: #6c757d;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 1px;
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