<template>
  <div class="container-fluid" style="padding-top: 100px; padding-bottom: 20px; min-height: calc(100vh - 100px);">
    <!-- Notificação de sucesso fixa no topo -->
    <div v-if="sucesso" class="alert alert-success text-center fw-bold position-fixed" role="alert" style="top: 80px; left: 50%; transform: translateX(-50%); z-index: 9999; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 0.375rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
      <i class="bi bi-check-circle-fill me-2"></i>
      Cliente atualizado com sucesso!
    </div>
    
    <div class="card shadow-lg border-0" style="max-width: 1200px; width: 100%; margin: 0 auto;">
      <div class="card-header text-center py-2" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); border: none;">
        <h3 class="text-white fw-bold mb-0" style="font-size: 1.2rem;">
          <i class="bi bi-pencil-square me-2"></i>
          Editar Cliente
        </h3>
      </div>
      <div class="card-body p-2">
        <form @submit.prevent="salvarCliente">
          <!-- Tipo de Cliente -->
          <div class="row mb-1">
            <div class="col-12">
              <h5 class="fw-bold mb-1" style="color: #6c757d; font-size: 0.9rem;">
                <i class="bi bi-person-badge me-2"></i>
                Tipo de Cliente
              </h5>
            </div>
            <div class="col-12">
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="tipoCliente" id="fisica" value="fisica" v-model="cliente.tipo">
                <label class="btn btn-outline-primary" for="fisica">
                  <i class="bi bi-person me-1"></i>Pessoa Física
                </label>
                
                <input type="radio" class="btn-check" name="tipoCliente" id="juridica" value="juridica" v-model="cliente.tipo">
                <label class="btn btn-outline-primary" for="juridica">
                  <i class="bi bi-building me-1"></i>Pessoa Jurídica
                </label>
              </div>
            </div>
          </div>

          <!-- PESSOA FÍSICA -->
          <div v-if="cliente.tipo === 'fisica'">
            <!-- Informações Pessoais -->
            <div class="row mb-1">
              <div class="col-12">
                <h5 class="fw-bold mb-1" style="color: #6c757d; font-size: 0.9rem;">
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
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.dataNascimento)">
                  <i class="bi bi-calendar me-1"></i>Data de Nascimento
                </label>
                <input v-model="cliente.dataNascimento" type="date" class="form-control" />
              </div>
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.genero)">
                  <i class="bi bi-gender-ambiguous me-1"></i>Gênero
                </label>
                <select v-model="cliente.genero" class="form-select">
                  <option value="">Selecione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>
              <div class="col-md-4 mb-1">
                <label class="form-label fw-bold" :class="getLabelClass(cliente.estadoCivil)">
                  <i class="bi bi-heart me-1"></i>Estado Civil
                </label>
                <select v-model="cliente.estadoCivil" class="form-select">
                  <option value="">Selecione...</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- PESSOA JURÍDICA -->
          <div v-if="cliente.tipo === 'juridica'">
            <!-- Informações Empresariais -->
            <div class="row mb-1">
              <div class="col-12">
                <h5 class="fw-bold mb-1" style="color: #6c757d; font-size: 0.9rem;">
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
          <div class="row mb-1">
            <div class="col-12">
              <h5 class="fw-bold mb-1" style="color: #6c757d; font-size: 0.9rem;">
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

          <!-- Endereço -->
          <div class="row mb-1">
            <div class="col-12">
              <h5 class="fw-bold mb-1" style="color: #6c757d; font-size: 0.9rem;">
                <i class="bi bi-geo-alt me-2"></i>
                Endereço
              </h5>
            </div>
            <div class="col-md-2 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.cep)">
                <i class="bi bi-pin-map me-1"></i>CEP
              </label>
              <input v-model="cliente.cep" type="text" class="form-control" />
            </div>
            <div class="col-md-6 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.logradouro)">
                <i class="bi bi-signpost me-1"></i>Logradouro
              </label>
              <input v-model="cliente.logradouro" type="text" class="form-control" />
            </div>
            <div class="col-md-2 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.numero)">
                <i class="bi bi-hash me-1"></i>Número
              </label>
              <input v-model="cliente.numero" type="text" class="form-control" />
            </div>
            <div class="col-md-2 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.complemento)">
                <i class="bi bi-house me-1"></i>Complemento
              </label>
              <input v-model="cliente.complemento" type="text" class="form-control" />
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.bairro)">
                <i class="bi bi-geo me-1"></i>Bairro
              </label>
              <input v-model="cliente.bairro" type="text" class="form-control" />
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.cidade)">
                <i class="bi bi-building me-1"></i>Cidade
              </label>
              <input v-model="cliente.cidade" type="text" class="form-control" />
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.estado)">
                <i class="bi bi-geo-alt me-1"></i>Estado
              </label>
              <select v-model="cliente.estado" class="form-select">
                <option value="">Selecione...</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.pais)">
                <i class="bi bi-globe me-1"></i>País
              </label>
              <input v-model="cliente.pais" type="text" class="form-control" />
            </div>
          </div>

          <!-- Informações Adicionais -->
          <div class="row mb-1">
            <div class="col-12">
              <h5 class="fw-bold mb-1" style="color: #6c757d; font-size: 0.9rem;">
                <i class="bi bi-info-circle me-2"></i>
                Informações Adicionais
              </h5>
            </div>
            <div class="col-md-6 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.observacoes)">
                <i class="bi bi-chat-text me-1"></i>Observações
              </label>
              <textarea v-model="cliente.observacoes" class="form-control" rows="3" placeholder="Observações sobre o cliente..."></textarea>
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.dataCadastro)">
                <i class="bi bi-calendar-check me-1"></i>Data de Cadastro
              </label>
              <input v-model="cliente.dataCadastro" type="date" class="form-control" readonly />
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label fw-bold" :class="getLabelClass(cliente.status)">
                <i class="bi bi-toggle-on me-1"></i>Status
              </label>
              <select v-model="cliente.status" class="form-select">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          <!-- Botões -->
          <div class="d-flex gap-2 mt-2">
            <button type="submit" class="btn btn-primary fw-bold flex-fill">
              <i class="bi bi-check-circle me-2"></i>
              Salvar Alterações
            </button>
            <NuxtLink to="/clientes-lista" class="btn btn-secondary fw-bold">
              <i class="bi bi-arrow-left me-2"></i>
              Voltar
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

interface Cliente {
  id?: number
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
  
  // Informações Adicionais
  observacoes?: string
  dataCadastro?: string
  status?: string
}

const route = useRoute()
const cliente = reactive<Cliente>({
  tipo: 'fisica',
  pais: 'Brasil',
  status: 'ativo',
  nomeCompleto: '',
  celular: '',
  email: '',
  telefoneFixo: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  genero: '',
  estadoCivil: '',
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  inscricaoEstadual: '',
  inscricaoMunicipal: '',
  responsavelLegal: '',
  cpfResponsavel: '',
  telefoneResponsavel: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  observacoes: '',
  dataCadastro: ''
})

const sucesso = ref(false)

function getLabelClass(value: string | undefined): string {
  if (!value || value.trim() === '') {
    return 'label-empty'
  }
  return 'label-filled'
}

async function carregarCliente() {
  const id = route.params.id
  if (id) {
    try {
      const res = await fetch(`/api/clientes/${id}`)
      const dados = await res.json()
      
      // Mapear dados legados para novos campos
      const clienteMapeado = {
        ...dados,
        // Se nomeCompleto estiver vazio mas nome não, usar nome
        nomeCompleto: dados.nomeCompleto || dados.nome || '',
        // Se celular estiver vazio mas telefone não, usar telefone
        celular: dados.celular || dados.telefone || '',
        // Garantir que o tipo seja definido
        tipo: dados.tipo || 'fisica',
        // Garantir valores padrão
        pais: dados.pais || 'Brasil',
        status: dados.status || 'ativo'
      }
      
      // Limpar campos legados
      delete clienteMapeado.nome
      delete clienteMapeado.telefone
      
      // Atribuir dados mapeados ao objeto reativo
      cliente.nomeCompleto = clienteMapeado.nomeCompleto
      cliente.celular = clienteMapeado.celular
      cliente.email = clienteMapeado.email || ''
      cliente.telefoneFixo = clienteMapeado.telefoneFixo || ''
      cliente.cpf = clienteMapeado.cpf || ''
      cliente.rg = clienteMapeado.rg || ''
      cliente.dataNascimento = clienteMapeado.dataNascimento || ''
      cliente.genero = clienteMapeado.genero || ''
      cliente.estadoCivil = clienteMapeado.estadoCivil || ''
      cliente.razaoSocial = clienteMapeado.razaoSocial || ''
      cliente.nomeFantasia = clienteMapeado.nomeFantasia || ''
      cliente.cnpj = clienteMapeado.cnpj || ''
      cliente.inscricaoEstadual = clienteMapeado.inscricaoEstadual || ''
      cliente.inscricaoMunicipal = clienteMapeado.inscricaoMunicipal || ''
      cliente.responsavelLegal = clienteMapeado.responsavelLegal || ''
      cliente.cpfResponsavel = clienteMapeado.cpfResponsavel || ''
      cliente.telefoneResponsavel = clienteMapeado.telefoneResponsavel || ''
      cliente.cep = clienteMapeado.cep || ''
      cliente.logradouro = clienteMapeado.logradouro || ''
      cliente.numero = clienteMapeado.numero || ''
      cliente.complemento = clienteMapeado.complemento || ''
      cliente.bairro = clienteMapeado.bairro || ''
      cliente.cidade = clienteMapeado.cidade || ''
      cliente.estado = clienteMapeado.estado || ''
      cliente.pais = clienteMapeado.pais
      cliente.observacoes = clienteMapeado.observacoes || ''
      cliente.dataCadastro = clienteMapeado.dataCadastro || ''
      cliente.tipo = clienteMapeado.tipo
      cliente.status = clienteMapeado.status
      console.log('Cliente carregado:', cliente)
      
      // Debug: mostrar dados carregados na tela temporariamente
      setTimeout(() => {
        console.log('Dados do formulário após carregamento:')
        console.log('nomeCompleto:', cliente.nomeCompleto)
        console.log('celular:', cliente.celular)
        console.log('tipo:', cliente.tipo)
        console.log('pais:', cliente.pais)
        console.log('status:', cliente.status)
      }, 100)
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
      alert('Erro ao carregar dados do cliente')
    }
  }
}

async function salvarCliente() {
  const id = route.params.id
  try {
    const response = await fetch(`/api/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    })
    
    if (response.ok) {
      sucesso.value = true
      // Reduzir tempo de exibição e usar scroll suave
      setTimeout(() => {
        sucesso.value = false
        // Scroll suave para o topo se necessário
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 2000)
      console.log('Cliente atualizado com sucesso')
    } else {
      const errorData = await response.json()
      alert('Erro ao atualizar cliente: ' + (errorData.message || 'Erro desconhecido'))
    }
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    alert('Erro ao salvar cliente. Tente novamente.')
  }
}

onMounted(carregarCliente)
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