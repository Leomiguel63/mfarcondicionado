<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="card shadow-lg border-0" style="max-width: 900px; width: 100%; margin: 0 auto;">
              <div class="card-header text-center py-2" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); border: none;">
          <h3 class="text-white fw-bold mb-0">
            <i class="bi bi-person-plus me-2"></i>
            Cadastro de Clientes
          </h3>
        </div>
      <div class="card-body p-2">
        <form @submit.prevent="adicionarCliente">
          <!-- Tipo de Cliente -->
          <div class="row mb-2">
                          <div class="col-12">
                <h5 class="fw-bold mb-1" style="color: #6c757d;">
                  <i class="bi bi-person-badge me-2"></i>
                  Tipo de Cliente
                </h5>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="tipoCliente" id="pessoaFisica" value="fisica" v-model="cliente.tipo" checked>
                <label class="btn btn-outline-primary" for="pessoaFisica">
                  <i class="bi bi-person me-1"></i>Pessoa Física
                </label>
                
                <input type="radio" class="btn-check" name="tipoCliente" id="pessoaJuridica" value="juridica" v-model="cliente.tipo">
                <label class="btn btn-outline-primary" for="pessoaJuridica">
                  <i class="bi bi-building me-1"></i>Pessoa Jurídica
                </label>
              </div>
            </div>
          </div>

          <!-- PESSOA FÍSICA -->
          <div v-if="cliente.tipo === 'fisica'">
            <!-- Informações Pessoais -->
            <div class="row mb-2">
              <div class="col-12">
                <h5 class="fw-bold mb-2" style="color: #6c757d;">
                  <i class="bi bi-person-vcard me-2"></i>
                  Informações Pessoais
                </h5>
              </div>
              <div class="col-md-6 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.nomeCompleto)">
                  <i class="bi bi-person me-1"></i>Nome Completo *
                </label>
                <input v-model="cliente.nomeCompleto" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-3 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.cpf)">
                  <i class="bi bi-card-text me-1"></i>CPF
                </label>
                <input v-model="cliente.cpf" type="text" class="form-control" />
              </div>
              <div class="col-md-3 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.rg)">
                  <i class="bi bi-card-text me-1"></i>RG
                </label>
                <input v-model="cliente.rg" type="text" class="form-control" />
              </div>

            </div>
          </div>

          <!-- PESSOA JURÍDICA -->
          <div v-if="cliente.tipo === 'juridica'">
            <!-- Informações Empresariais -->
            <div class="row mb-2">
              <div class="col-12">
                <h5 class="fw-bold mb-2" style="color: #6c757d;">
                  <i class="bi bi-building me-2"></i>
                  Informações Empresariais
                </h5>
              </div>
              <div class="col-md-8 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.razaoSocial)">
                  <i class="bi bi-building me-1"></i>Razão Social *
                </label>
                <input v-model="cliente.razaoSocial" type="text" class="form-control form-control-lg" required />
              </div>
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.cnpj)">
                  <i class="bi bi-card-text me-1"></i>CNPJ
                </label>
                <input v-model="cliente.cnpj" type="text" class="form-control" />
              </div>
              <div class="col-md-6 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.nomeFantasia)">
                  <i class="bi bi-shop me-1"></i>Nome Fantasia
                </label>
                <input v-model="cliente.nomeFantasia" type="text" class="form-control" />
              </div>
              <div class="col-md-3 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.inscricaoEstadual)">
                  <i class="bi bi-file-text me-1"></i>Inscrição Estadual
                </label>
                <input v-model="cliente.inscricaoEstadual" type="text" class="form-control" />
              </div>
              <div class="col-md-3 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.inscricaoMunicipal)">
                  <i class="bi bi-file-text me-1"></i>Inscrição Municipal
                </label>
                <input v-model="cliente.inscricaoMunicipal" type="text" class="form-control" />
              </div>
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.responsavelLegal)">
                  <i class="bi bi-person me-1"></i>Responsável Legal
                </label>
                <input v-model="cliente.responsavelLegal" type="text" class="form-control" />
              </div>
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.cpfResponsavel)">
                  <i class="bi bi-card-text me-1"></i>CPF do Responsável
                </label>
                <input v-model="cliente.cpfResponsavel" type="text" class="form-control" />
              </div>
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.telefoneResponsavel)">
                  <i class="bi bi-telephone me-1"></i>Telefone do Responsável
                </label>
                <input v-model="cliente.telefoneResponsavel" type="text" class="form-control" />
              </div>
            </div>
          </div>

          <!-- Informações de Contato -->
          <div class="row mb-2">
            <div class="col-12">
              <h5 class="fw-bold mb-2" style="color: #6c757d;">
                <i class="bi bi-telephone me-2"></i>
                Informações de Contato
              </h5>
            </div>
            <div class="col-md-4 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.email)">
                <i class="bi bi-envelope me-1"></i>E-mail
              </label>
              <input v-model="cliente.email" type="email" class="form-control" />
            </div>
            <div class="col-md-4 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.celular)">
                <i class="bi bi-whatsapp me-1"></i>Celular / WhatsApp
              </label>
              <input v-model="cliente.celular" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.telefoneFixo)">
                <i class="bi bi-telephone me-1"></i>Telefone Fixo
              </label>
              <input v-model="cliente.telefoneFixo" type="text" class="form-control" />
            </div>
          </div>





          <!-- Botão Salvar -->
          <div class="d-grid gap-2 mt-3">
            <button type="submit" class="btn fw-bold" :class="sucesso ? 'btn-success' : 'btn-primary'">
              <i :class="sucesso ? 'bi bi-check-circle-fill' : 'bi bi-plus-circle'" class="me-2"></i>
              {{ sucesso ? 'Cliente Cadastrado!' : 'Cadastrar Cliente' }}
            </button>
          </div>
          
          <div v-if="sucesso" class="alert alert-success mt-3 text-center fw-bold" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            Cliente cadastrado com sucesso!
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

interface Cliente {
  // Tipo de cliente
  tipo: 'fisica' | 'juridica'
  
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
}

const cliente = reactive<Cliente>({
  tipo: 'fisica',
  pais: 'Brasil'
})

const clientes = ref<Cliente[]>([])
const sucesso = ref(false)

function getLabelClass(value: string | undefined): string {
  if (!value || value.trim() === '') {
    return 'label-empty'
  }
  return 'label-filled'
}

async function buscarClientes() {
  const res = await fetch('/api/clientes')
  clientes.value = await res.json()
}

async function adicionarCliente() {
  await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  })
  sucesso.value = true
  setTimeout(() => sucesso.value = false, 3000)
  
  // Limpar formulário
  Object.keys(cliente).forEach(key => {
    if (key !== 'tipo' && key !== 'pais') {
      (cliente as any)[key] = ''
    }
  })
  cliente.tipo = 'fisica'
  cliente.pais = 'Brasil'
  
  await buscarClientes()
}

onMounted(buscarClientes)
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.btn-check:checked + .btn-outline-primary {
  background-color: #1c74cb;
  border-color: #1c74cb;
  color: white;
}

.btn-outline-primary {
  border-color: #1c74cb;
  color: #1c74cb;
}

.btn-outline-primary:hover {
  background-color: #1c74cb;
  border-color: #1c74cb;
  color: white;
}

/* Reduzir espaçamento dos inputs */
.form-control, .form-select {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
  background: #fff !important;
  color: #333 !important;
}

.form-control-lg {
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
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
</style> 