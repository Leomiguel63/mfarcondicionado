<template>
  <div class="container-fluid min-vh-100" style="padding-top: 120px; padding-bottom: 50px;">
    <div class="container">
      <div class="card shadow-lg border-0">
        <div class="card-header text-center py-3" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); border: none;">
          <h2 class="text-white fw-bold mb-0">
            <i class="bi bi-people me-2"></i>
            Lista de Clientes
          </h2>
        </div>
        <div class="card-body p-3">
          <div class="row mb-4">
            <div class="col-md-6 mx-auto">
              <div class="input-group input-group-lg">
                <span class="input-group-text" style="background: #1c74cb; border-color: #1c74cb; color: white;">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  v-model="busca" 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por nome, CPF/CNPJ, telefone..."
                />
              </div>
            </div>
          </div>
          
          <div class="row g-3">
            <div v-for="cliente in clientesFiltrados" :key="cliente.id" class="col-md-6 col-lg-4">
              <div class="card h-100 border-0 shadow-sm" style="transition: all 0.3s ease;">
                <div class="card-header text-center py-3" :style="cliente.tipo === 'fisica' ? 'background: linear-gradient(135deg, #1c74cb 0%, #1565c0 100%);' : 'background: linear-gradient(135deg, #1c74cb 0%, #1565c0 100%);'">
                  <div class="d-flex align-items-center justify-content-center">
                    <i :class="cliente.tipo === 'fisica' ? 'bi bi-person-circle' : 'bi bi-building'" 
                       style="font-size: 2rem; color: white; margin-right: 10px;"></i>
                    <span class="text-white fw-bold">
                      {{ cliente.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
                    </span>
                  </div>
                </div>
                <div class="card-body p-3">
                  <h5 class="card-title fw-bold text-center mb-3" style="color: #1c74cb;">
                    {{ getNomePrincipal(cliente) }}
                  </h5>
                  
                  <!-- Informações principais -->
                  <div class="mb-3">
                    <div v-if="cliente.tipo === 'fisica' && cliente.cpf" class="mb-2">
                      <small class="text-muted fw-bold">
                        <i class="bi bi-card-text me-1"></i>CPF:
                      </small>
                      <div class="fw-bold">{{ cliente.cpf }}</div>
                    </div>
                    <div v-if="cliente.tipo === 'juridica' && cliente.cnpj" class="mb-2">
                      <small class="text-muted fw-bold">
                        <i class="bi bi-card-text me-1"></i>CNPJ:
                      </small>
                      <div class="fw-bold">{{ cliente.cnpj }}</div>
                    </div>
                  </div>
                  
                  <!-- Contato -->
                  <div class="mb-3">
                    <div v-if="cliente.email" class="mb-2">
                      <small class="text-muted fw-bold">
                        <i class="bi bi-envelope me-1"></i>E-mail:
                      </small>
                      <div class="text-break">{{ cliente.email }}</div>
                    </div>
                    <div v-if="cliente.celular" class="mb-2">
                      <small class="text-muted fw-bold">
                        <i class="bi bi-whatsapp me-1"></i>Celular:
                      </small>
                      <div>{{ cliente.celular }}</div>
                    </div>
                    <div v-if="cliente.telefoneFixo" class="mb-2">
                      <small class="text-muted fw-bold">
                        <i class="bi bi-telephone me-1"></i>Telefone:
                      </small>
                      <div>{{ cliente.telefoneFixo }}</div>
                    </div>
                  </div>
                  
                  <!-- Endereço -->
                  <div v-if="cliente.cidade && cliente.estado" class="mb-3">
                    <small class="text-muted fw-bold">
                      <i class="bi bi-geo-alt me-1"></i>Localização:
                    </small>
                    <div>{{ cliente.cidade }}, {{ cliente.estado }}</div>
                  </div>
                  
                  <!-- Informações específicas -->
                  <div v-if="cliente.tipo === 'fisica' && cliente.dataNascimento" class="mb-3">
                    <small class="text-muted fw-bold">
                      <i class="bi bi-calendar me-1"></i>Nascimento:
                    </small>
                    <div>{{ formatarData(cliente.dataNascimento) }}</div>
                  </div>
                  
                  <div v-if="cliente.tipo === 'juridica' && cliente.responsavelLegal" class="mb-3">
                    <small class="text-muted fw-bold">
                      <i class="bi bi-person me-1"></i>Responsável:
                    </small>
                    <div>{{ cliente.responsavelLegal }}</div>
                  </div>
                </div>
                <div class="card-footer bg-transparent border-0 text-center">
                  <NuxtLink :to="`/detalhes-cliente/${cliente.id}`" class="btn btn-outline-primary btn-sm me-2">
                    <i class="bi bi-eye me-1"></i>Ver Detalhes
                  </NuxtLink>
                  <NuxtLink :to="`/editar-cliente/${cliente.id}`" class="btn btn-outline-primary btn-sm me-2">
                    <i class="bi bi-pencil me-1"></i>Editar
                  </NuxtLink>
                  <button @click="confirmarApagarCliente(cliente.id)" class="btn btn-outline-danger btn-sm">
                    <i class="bi bi-trash me-1"></i>Apagar
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="clientesFiltrados.length === 0" class="col-12">
              <div class="text-center py-5">
                <i class="bi bi-people" style="font-size: 4rem; color: #1c74cb; opacity: 0.5;"></i>
                <h4 class="mt-3 fw-bold" style="color: #1c74cb;">Nenhum cliente encontrado</h4>
                <p class="text-muted">Tente ajustar sua busca ou cadastre um novo cliente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.4);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Exclusão</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja apagar este cliente? Esta ação não pode ser desfeita.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">Cancelar</button>
          <button class="btn btn-danger" @click="apagarCliente(confirmarId)">Apagar</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="mensagem" class="alert" :class="mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'" style="position:fixed;top:90px;left:50%;transform:translateX(-50%);z-index:2000;min-width:300px;max-width:90vw;">
    {{ mensagem.texto }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Cliente {
  id?: number
  tipo?: 'fisica' | 'juridica'
  
  // Informações Pessoais (Pessoa Física)
  nomeCompleto?: string
  cpf?: string
  rg?: string
  dataNascimento?: string
  genero?: string
  estadoCivil?: string
  
  // Informações Empresariais (Pessoa Jurídica)
  razaoSocial?: string
  nomeFantasia?: string
  cnpj?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  responsavelLegal?: string
  cpfResponsavel?: string
  telefoneResponsavel?: string
  
  // Informações de Contato
  email?: string
  telefoneFixo?: string
  celular?: string
  
  // Endereço
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  pais?: string
  
  // Informações Fiscais
  inscricaoEstadualFiscal?: string
  classificacaoFiscal?: string
  
  // Campos legados
  nome?: string
  telefone?: string
}

const clientes = ref<Cliente[]>([])
const busca = ref('')
const showModal = ref(false)
const confirmarId = ref<number | null>(null)
const mensagem = ref<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null)

const clientesFiltrados = computed(() => {
  if (!busca.value) return clientes.value
  const termo = busca.value.toLowerCase()
  return clientes.value.filter(cliente => {
    const nome = getNomePrincipal(cliente).toLowerCase()
    const cpfCnpj = (cliente.cpf || cliente.cnpj || '').toLowerCase()
    const telefone = (cliente.celular || cliente.telefoneFixo || cliente.telefoneResponsavel || '').toLowerCase()
    const email = (cliente.email || '').toLowerCase()
    
    return nome.includes(termo) || 
           cpfCnpj.includes(termo) || 
           telefone.includes(termo) ||
           email.includes(termo)
  })
})

function getNomePrincipal(cliente: Cliente): string {
  if (cliente.tipo === 'fisica') {
    return cliente.nomeCompleto || cliente.nome || 'Nome não informado'
  } else if (cliente.tipo === 'juridica') {
    return cliente.razaoSocial || cliente.nomeFantasia || cliente.nome || 'Razão social não informada'
  }
  return cliente.nome || 'Nome não informado'
}

function formatarData(data: string): string {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

async function buscarClientes() {
  const res = await fetch('/api/clientes')
  clientes.value = await res.json()
}

function confirmarApagarCliente(id: number | undefined) {
  if (id) {
    confirmarId.value = id
    showModal.value = true
  }
}

async function apagarCliente(id: number | null) {
  if (!id) return
  showModal.value = false
  try {
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      await buscarClientes()
      mensagem.value = { tipo: 'sucesso', texto: 'Cliente apagado com sucesso!' }
      setTimeout(() => mensagem.value = null, 2500)
    } else {
      const erro = await res.json()
      mensagem.value = { tipo: 'erro', texto: erro.statusMessage || 'Erro ao apagar cliente.' }
      setTimeout(() => mensagem.value = null, 4000)
    }
  } catch (e) {
    mensagem.value = { tipo: 'erro', texto: 'Erro ao apagar cliente.' }
    setTimeout(() => mensagem.value = null, 4000)
  }
  confirmarId.value = null
}

onMounted(buscarClientes)
</script>

<style scoped>
/* Estilos personalizados para os cards */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.input-group-text {
  border-radius: 0.375rem 0 0 0.375rem;
}

.form-control {
  border-radius: 0 0.375rem 0.375rem 0;
}

.btn-outline-primary {
  border-color: #1c74cb;
  color: #1c74cb;
}

.btn-outline-primary:hover {
  background-color: #1c74cb;
  border-color: #1c74cb;
  color: white;
  transform: translateY(-2px);
}

/* Reduzir espaçamento dos inputs */
.form-control {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
  background: #fff !important;
  color: #333 !important;
}

/* Reduzir espaçamento dos labels */
small {
  font-size: 0.8rem;
}

/* Reduzir espaçamento dos títulos */
h5 {
  font-size: 0.9rem;
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