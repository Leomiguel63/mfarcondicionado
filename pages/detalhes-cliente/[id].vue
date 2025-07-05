<template>
  <div class="container-fluid" style="padding-top: 120px; padding-bottom: 30px; min-height: calc(100vh - 120px);">
    <div class="row">
      <!-- Informações do Cliente -->
      <div class="col-lg-5 col-md-7 col-12">
        <div class="card shadow-lg border-0 mb-3" style="font-size:0.92rem;">
          <div class="card-header text-center py-2" style="background: linear-gradient(135deg, #1c74cb 0%, #1565c0 100%); border: none;">
            <h4 class="text-white fw-bold mb-0" style="font-size:1.1rem;">
              <i class="bi bi-person-circle me-2"></i>
              Detalhes do Cliente
            </h4>
          </div>
          <div class="card-body p-2">
            <!-- Tipo de Cliente -->
            <div class="row mb-3">
              <div class="col-12">
                <div class="d-flex align-items-center mb-3">
                  <div class="badge bg-primary fs-6 me-3">
                    <i :class="cliente.tipo === 'fisica' ? 'bi bi-person' : 'bi bi-building'" class="me-2"></i>
                    {{ cliente.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica' }}
                  </div>
                  <div class="badge" :class="getStatusClass(cliente.status)">
                    {{ cliente.status }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Informações Principais -->
            <div class="row mb-4">
              <div class="col-12">
                <h4 class="fw-bold mb-3" style="color: #1c74cb;">
                  {{ getNomePrincipal(cliente) }}
                </h4>
              </div>
              
              <!-- Pessoa Física -->
              <div v-if="cliente.tipo === 'fisica'" class="col-md-6">
                <div class="mb-3">
                  <label class="fw-bold text-muted">CPF:</label>
                  <div>{{ cliente.cpf || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">RG:</label>
                  <div>{{ cliente.rg || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Data de Nascimento:</label>
                  <div>{{ formatarData(cliente.dataNascimento) || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Gênero:</label>
                  <div>{{ getGeneroText(cliente.genero) || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Estado Civil:</label>
                  <div>{{ getEstadoCivilText(cliente.estadoCivil) || 'Não informado' }}</div>
                </div>
              </div>

              <!-- Pessoa Jurídica -->
              <div v-if="cliente.tipo === 'juridica'" class="col-md-6">
                <div class="mb-3">
                  <label class="fw-bold text-muted">CNPJ:</label>
                  <div>{{ cliente.cnpj || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Nome Fantasia:</label>
                  <div>{{ cliente.nomeFantasia || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Inscrição Estadual:</label>
                  <div>{{ cliente.inscricaoEstadual || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Inscrição Municipal:</label>
                  <div>{{ cliente.inscricaoMunicipal || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Responsável Legal:</label>
                  <div>{{ cliente.responsavelLegal || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">CPF do Responsável:</label>
                  <div>{{ cliente.cpfResponsavel || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Telefone do Responsável:</label>
                  <div>{{ cliente.telefoneResponsavel || 'Não informado' }}</div>
                </div>
              </div>

              <!-- Contato -->
              <div class="col-md-6">
                <h5 class="fw-bold mb-3" style="color: #6c757d;">
                  <i class="bi bi-telephone me-2"></i>Contato
                </h5>
                <div class="mb-3">
                  <label class="fw-bold text-muted">E-mail:</label>
                  <div>{{ cliente.email || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Celular/WhatsApp:</label>
                  <div>{{ cliente.celular || 'Não informado' }}</div>
                </div>
                <div class="mb-3">
                  <label class="fw-bold text-muted">Telefone Fixo:</label>
                  <div>{{ cliente.telefoneFixo || 'Não informado' }}</div>
                </div>
              </div>
            </div>

            <!-- Endereço -->
            <div class="row mb-4" v-if="cliente.cidade || cliente.estado">
              <div class="col-12">
                <h5 class="fw-bold mb-3" style="color: #6c757d;">
                  <i class="bi bi-geo-alt me-2"></i>Endereço
                </h5>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label class="fw-bold text-muted">CEP:</label>
                      <div>{{ cliente.cep || 'Não informado' }}</div>
                    </div>
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Logradouro:</label>
                      <div>{{ cliente.logradouro || 'Não informado' }}</div>
                    </div>
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Número:</label>
                      <div>{{ cliente.numero || 'Não informado' }}</div>
                    </div>
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Complemento:</label>
                      <div>{{ cliente.complemento || 'Não informado' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Bairro:</label>
                      <div>{{ cliente.bairro || 'Não informado' }}</div>
                    </div>
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Cidade:</label>
                      <div>{{ cliente.cidade || 'Não informado' }}</div>
                    </div>
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Estado:</label>
                      <div>{{ cliente.estado || 'Não informado' }}</div>
                    </div>
                    <div class="mb-2">
                      <label class="fw-bold text-muted">País:</label>
                      <div>{{ cliente.pais || 'Brasil' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observações -->
            <div class="row mb-4" v-if="cliente.observacoes">
              <div class="col-12">
                <h5 class="fw-bold mb-3" style="color: #6c757d;">
                  <i class="bi bi-chat-text me-2"></i>Observações
                </h5>
                <div class="p-3 bg-light rounded">
                  {{ cliente.observacoes }}
                </div>
              </div>
            </div>

            <!-- Informações do Sistema -->
            <div class="row">
              <div class="col-12">
                <h5 class="fw-bold mb-3" style="color: #6c757d;">
                  <i class="bi bi-info-circle me-2"></i>Informações do Sistema
                </h5>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label class="fw-bold text-muted">Data de Cadastro:</label>
                      <div>{{ formatarData(cliente.dataCadastro) }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label class="fw-bold text-muted">ID do Cliente:</label>
                      <div>{{ cliente.id }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orçamentos -->
      <div class="col-lg-7 col-md-5 col-12">
        <div class="card shadow-lg border-0">
          <div class="card-header text-center py-2" style="background: linear-gradient(135deg, #1c74cb 0%, #1565c0 100%); border: none;">
            <h4 class="text-white fw-bold mb-0" style="font-size:1.1rem;">
              <i class="bi bi-currency-dollar me-2"></i>
              Histórico de Orçamentos
            </h4>
          </div>
          <div class="card-body p-2">
            <div v-if="orcamentos.length === 0" class="text-center py-3">
              <i class="bi bi-currency-dollar" style="font-size: 2.5rem; color: #6c757d; opacity: 0.5;"></i>
              <p class="mt-2 text-muted" style="font-size:0.9rem;">Nenhum orçamento encontrado</p>
              <button class="btn btn-primary btn-sm" @click="abrirEditModal()">
                <i class="bi bi-plus-circle me-1"></i>Novo Orçamento
              </button>
            </div>

            <div v-else>
              <!-- Resumo dos Orçamentos -->
              <div class="row mb-3">
                <div class="col-12">
                  <div class="d-flex justify-content-center align-items-center p-2 bg-light rounded">
                    <div class="text-center">
                      <div class="fw-bold text-primary">{{ orcamentos.length }}</div>
                      <small class="text-muted">Total de Orçamentos</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lista de Orçamentos -->
              <div class="accordion" id="accordionOrcamentos">
                <div v-for="(orcamento, index) in orcamentos" :key="orcamento.id" class="accordion-item border-0 mb-2">
                  <div class="card shadow-sm">
                    <div class="card-header p-2" :id="'heading' + orcamento.id">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <button class="btn btn-link btn-sm p-0 me-2" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + orcamento.id" aria-expanded="false" :aria-controls="'collapse' + orcamento.id">
                            <i class="bi bi-chevron-down"></i>
                          </button>
                          <div>
                            <h6 class="fw-bold mb-0" style="color: #1c74cb; font-size:0.9rem;">
                              Orçamento #{{ orcamento.id }}
                            </h6>
                            <small class="text-muted">{{ formatarData(orcamento.data) }}</small>
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <div class="fw-bold text-success" style="font-size:0.9rem;">
                            R$ {{ formatarValor(orcamento.valorTotal) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div :id="'collapse' + orcamento.id" class="collapse" :aria-labelledby="'heading' + orcamento.id" data-bs-parent="#accordionOrcamentos">
                      <div class="card-body p-2">
                        <!-- Detalhes do Serviço -->
                        <div class="row">
                          <div class="col-12 mb-2">
                            <h6 class="fw-bold mb-1" style="color: #6c757d; font-size:0.85rem;">
                              <i class="bi bi-tools me-1"></i>Detalhes do Serviço
                            </h6>
                            <div class="p-2 bg-light rounded">
                              <p class="mb-1" style="font-size:0.85rem;">{{ orcamento.descricao || 'Sem descrição detalhada' }}</p>
                            </div>
                          </div>
                          
                          <!-- Observações -->
                          <div v-if="orcamento.observacoes" class="col-12 mb-2">
                            <h6 class="fw-bold mb-1" style="color: #6c757d; font-size:0.85rem;">
                              <i class="bi bi-chat-text me-1"></i>Observações
                            </h6>
                            <div class="p-2 bg-light rounded">
                              <p class="mb-0" style="font-size:0.85rem;">{{ orcamento.observacoes }}</p>
                            </div>
                          </div>
                          
                          <!-- Informações Adicionais -->
                          <div class="col-md-6 mb-2">
                            <h6 class="fw-bold mb-1" style="color: #6c757d; font-size:0.85rem;">
                              <i class="bi bi-calendar me-1"></i>Data de Criação
                            </h6>
                            <div style="font-size:0.85rem;">{{ formatarData(orcamento.criadoEm) }}</div>
                          </div>
                          
                          <div class="col-md-6 mb-2">
                            <h6 class="fw-bold mb-1" style="color: #6c757d; font-size:0.85rem;">
                              <i class="bi bi-hash me-1"></i>ID do Orçamento
                            </h6>
                            <div style="font-size:0.85rem;">#{{ orcamento.id }}</div>
                          </div>

                          <div class="col-md-6 mb-2">
                            <h6 class="fw-bold mb-1" style="color: #6c757d; font-size:0.85rem;">
                              <i class="bi bi-person-badge me-1"></i>Responsável
                            </h6>
                            <div style="font-size:0.85rem;">{{ orcamento.responsavel ? orcamento.responsavel : 'Não informado' }}</div>
                          </div>
                        </div>
                        
                                                 <!-- Ações -->
                         <div class="d-flex gap-1 mt-2 pt-2 border-top">
                           <button class="btn btn-outline-primary btn-sm" @click="verOrcamento(orcamento.id)" style="font-size:0.8rem;">
                             <i class="bi bi-eye me-1"></i>Ver Completo
                           </button>
                           <button class="btn btn-outline-success btn-sm" @click="abrirEditInlineModal(orcamento)" style="font-size:0.8rem;">
                             <i class="bi bi-pencil me-1"></i>Editar
                           </button>
                           <button class="btn btn-outline-info btn-sm" @click="imprimirOrcamento(orcamento.id)" style="font-size:0.8rem;">
                             <i class="bi bi-printer me-1"></i>Imprimir
                           </button>
                           <button class="btn btn-outline-danger btn-sm" @click="confirmarDeletarOrcamento(orcamento.id)" style="font-size:0.8rem;">
                             <i class="bi bi-trash me-1"></i>Apagar
                           </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-3">
                <button class="btn btn-primary btn-sm" @click="abrirEditModal()">
                  <i class="bi bi-plus-circle me-1"></i>Novo Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="d-flex gap-2 justify-content-center">
          <NuxtLink :to="`/editar-cliente/${cliente.id}`" class="btn btn-primary">
            <i class="bi bi-pencil me-2"></i>Editar Cliente
          </NuxtLink>
          <NuxtLink to="/clientes-lista" class="btn btn-secondary">
            <i class="bi bi-arrow-left me-2"></i>Voltar à Lista
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="orcamentoModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.4);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Orçamento Completo #{{ orcamentoModal.id }}</h5>
            <button type="button" class="btn-close" @click="orcamentoModal = null"></button>
          </div>
          <div class="modal-body">
            <div><b>Data:</b> {{ formatarData(orcamentoModal.data) }}</div>
            <div><b>Valor Total:</b> R$ {{ formatarValor(orcamentoModal.valorTotal) }}</div>
            <div><b>Mão de Obra:</b> R$ {{ formatarValor(orcamentoModal.maoDeObra) }}</div>
            <div v-if="orcamentoModal.descricao"><b>Descrição:</b> {{ orcamentoModal.descricao }}</div>
            <div v-if="orcamentoModal.pecas">
              <b>Peças:</b>
              <ul>
                <li v-for="peca in parsePecas(orcamentoModal.pecas)" :key="peca.descricao">
                  {{ peca.descricao }} - {{ peca.quantidade }} x R$ {{ formatarValor(peca.valorUnitario) }} = R$ {{ formatarValor(peca.valorTotal) }}
                </li>
              </ul>
            </div>
            <div v-if="orcamentoModal.observacoes"><b>Observações:</b> {{ orcamentoModal.observacoes }}</div>
            <div v-if="orcamentoModal && orcamentoModal.responsavel"><b>Responsável:</b> {{ orcamentoModal.responsavel }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="orcamentoModal = null">Fechar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.4);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editOrcamento.id ? 'Editar Orçamento' : 'Novo Orçamento' }}</h5>
            <button type="button" class="btn-close" @click="fecharEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="salvarOrcamentoModal">
              <div class="row mb-3">
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-calendar me-1"></i>Data do Orçamento
                  </label>
                  <input v-model="editOrcamento.data" type="date" class="form-control" />
                </div>
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person me-1"></i>Cliente ID
                  </label>
                  <input v-model="editOrcamento.clienteId" type="number" class="form-control" readonly />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-12 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-chat-left-text me-1"></i>Descrição
                  </label>
                  <textarea v-model="editOrcamento.descricao" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-12 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-chat-left-text me-1"></i>Observações
                  </label>
                  <textarea v-model="editOrcamento.observacoes" class="form-control" rows="2"></textarea>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person-workspace me-1"></i>Mão de Obra (R$)
                  </label>
                  <input v-model.number="editOrcamento.maoDeObra" type="number" min="0" step="0.01" class="form-control" />
                </div>
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-calculator me-1"></i>Valor Total (R$)
                  </label>
                  <input :value="formatarValor(editValorTotalGeral)" type="text" class="form-control" readonly />
                </div>
              </div>
              <div class="mb-3">
                <h5 class="fw-bold mb-2" style="color: #6c757d;">
                  <i class="bi bi-puzzle-piece me-2"></i>Peças
                </h5>
                <div v-for="(peca, index) in editPecas" :key="index" class="card mb-2 border-0" style="background-color: #f8f9fa;">
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
                        <input :value="formatarValor(peca.valorUnitario * peca.quantidade)" type="text" class="form-control form-control-sm" readonly />
                      </div>
                      <div class="col-12 mt-2 text-end">
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removerEditPeca(index)">
                          <i class="bi bi-trash me-1"></i>Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="adicionarEditPeca">
                    <i class="bi bi-plus-circle me-1"></i>Adicionar Peça
                  </button>
                </div>
              </div>
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary fw-bold flex-fill">
                  <i class="bi bi-check-circle me-2"></i>
                  Salvar
                </button>
                <button type="button" class="btn btn-secondary fw-bold" @click="fecharEditModal">
                  <i class="bi bi-x me-2"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação para apagar orçamento -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.4);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja apagar este orçamento? Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">Cancelar</button>
            <button class="btn btn-danger" @click="apagarOrcamento(confirmarId)">Apagar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Variáveis para edição inline -->
    <div v-if="showEditInlineModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.4);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Orçamento</h5>
            <button type="button" class="btn-close" @click="fecharEditInlineModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="salvarEditInlineOrcamento">
              <div class="row mb-3">
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-calendar me-1"></i>Data do Orçamento
                  </label>
                  <input v-model="editInlineOrcamento.data" type="date" class="form-control" />
                </div>
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person me-1"></i>Cliente ID
                  </label>
                  <input v-model="editInlineOrcamento.clienteId" type="number" class="form-control" readonly />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-12 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-chat-left-text me-1"></i>Descrição
                  </label>
                  <textarea v-model="editInlineOrcamento.descricao" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-12 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-chat-left-text me-1"></i>Observações
                  </label>
                  <textarea v-model="editInlineOrcamento.observacoes" class="form-control" rows="2"></textarea>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-person-workspace me-1"></i>Mão de Obra (R$)
                  </label>
                  <input v-model.number="editInlineOrcamento.maoDeObra" type="number" min="0" step="0.01" class="form-control" />
                </div>
                <div class="col-md-6 mb-2">
                  <label class="form-label fw-bold">
                    <i class="bi bi-calculator me-1"></i>Valor Total (R$)
                  </label>
                  <input :value="formatarValor(editInlineValorTotalGeral)" type="text" class="form-control" readonly />
                </div>
              </div>
              <div class="mb-3">
                <h5 class="fw-bold mb-2" style="color: #6c757d;">
                  <i class="bi bi-puzzle-piece me-2"></i>Peças
                </h5>
                <div v-for="(peca, index) in editInlinePecas" :key="index" class="card mb-2 border-0" style="background-color: #f8f9fa;">
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
                        <input :value="formatarValor(peca.valorUnitario * peca.quantidade)" type="text" class="form-control form-control-sm" readonly />
                      </div>
                      <div class="col-12 mt-2 text-end">
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removerEditInlinePeca(index)">
                          <i class="bi bi-trash me-1"></i>Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="adicionarEditInlinePeca">
                    <i class="bi bi-plus-circle me-1"></i>Adicionar Peça
                  </button>
                </div>
              </div>
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary fw-bold flex-fill">
                  <i class="bi bi-check-circle me-2"></i>
                  Salvar
                </button>
                <button type="button" class="btn btn-secondary fw-bold" @click="fecharEditInlineModal">
                  <i class="bi bi-x me-2"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Adicionar exibição da mensagem no template, logo após o container principal -->
    <div v-if="mensagem" class="alert" :class="mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'" style="position:fixed;top:90px;left:50%;transform:translateX(-50%);z-index:2000;min-width:300px;max-width:90vw;">
      {{ mensagem.texto }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Definições de tipos
interface Cliente {
  id: number
  tipo: 'fisica' | 'juridica'
  nomeCompleto?: string
  razaoSocial?: string
  nomeFantasia?: string
  cpf?: string
  cnpj?: string
  rg?: string
  dataNascimento?: string
  genero?: string
  estadoCivil?: string
  email?: string
  celular?: string
  telefoneFixo?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  pais?: string
  observacoes?: string
  dataCadastro: string
  status?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  responsavelLegal?: string
  cpfResponsavel?: string
  telefoneResponsavel?: string
}

interface Orcamento {
  id: number
  clienteId: number
  data: string
  descricao?: string
  observacoes?: string
  valorTotal: number
  maoDeObra: number
  pecas?: string
  criadoEm?: string
  responsavel?: string
}

interface Peca {
  descricao: string
  valorUnitario: number
  quantidade: number
  valorTotal: number
}

// Variáveis reativas
const router = useRouter()
const route = useRoute()

const cliente = ref<Cliente>({} as Cliente)
const orcamentos = ref<Orcamento[]>([])
const orcamentoModal = ref<Orcamento | null>(null)
const showModal = ref(false)
const confirmarId = ref<number | null>(null)

// Variáveis para edição de orçamento
const showEditModal = ref(false)
const editOrcamento = ref<Partial<Orcamento>>({})
const editPecas = ref<Peca[]>([])

// Variáveis para edição inline
const showEditInlineModal = ref(false)
const editInlineOrcamento = ref<Partial<Orcamento>>({})
const editInlinePecas = ref<Peca[]>([])

// Adicionar variável reativa para mensagem
const mensagem = ref<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null)

// Computed properties
const editValorTotalGeral = computed(() => {
  const subtotalPecas = editPecas.value.reduce((total, peca) => {
    peca.valorTotal = peca.valorUnitario * peca.quantidade
    return total + peca.valorTotal
  }, 0)
  return subtotalPecas + (editOrcamento.value.maoDeObra || 0)
})

const editInlineValorTotalGeral = computed(() => {
  const subtotal = editInlinePecas.value.reduce((total, p) => total + (p.valorUnitario * p.quantidade), 0)
  return subtotal + (editInlineOrcamento.value.maoDeObra || 0)
})

function getNomePrincipal(cliente: Cliente): string {
  if (cliente.tipo === 'fisica') {
    return cliente.nomeCompleto || 'Nome não informado'
  } else {
    return cliente.razaoSocial || 'Razão social não informada'
  }
}

function formatarData(data: string | undefined): string {
  if (!data) return 'Não informado'
  return new Date(data).toLocaleDateString('pt-BR')
}

function formatarValor(valor: number): string {
  return valor.toFixed(2).replace('.', ',')
}

function getGeneroText(genero: string | undefined): string {
  if (!genero) return 'Não informado'
  const generos = {
    'M': 'Masculino',
    'F': 'Feminino',
    'O': 'Outro'
  }
  return generos[genero as keyof typeof generos] || genero
}

function getEstadoCivilText(estadoCivil: string | undefined): string {
  if (!estadoCivil) return 'Não informado'
  const estados = {
    'solteiro': 'Solteiro(a)',
    'casado': 'Casado(a)',
    'divorciado': 'Divorciado(a)',
    'viuvo': 'Viúvo(a)'
  }
  return estados[estadoCivil as keyof typeof estados] || estadoCivil
}

function getStatusClass(status: string | undefined): string {
  const classes = {
    'ativo': 'bg-success',
    'inativo': 'bg-secondary',
    'bloqueado': 'bg-danger'
  }
  return classes[status as keyof typeof classes] || 'bg-secondary'
}

function verOrcamento(id: number) {
  const orc = orcamentos.value.find(o => o.id === id)
  if (orc) orcamentoModal.value = orc
}

function editarOrcamento(id: number) {
  router.push(`/orcamento/${id}`)
}

async function imprimirOrcamento(id: number) {
  try {
    console.log('Imprimir orçamento:', id)
    // Buscar dados completos do orçamento
    const response = await fetch(`/api/orcamentos/${id}`)
    if (!response.ok) {
      alert('Erro ao buscar dados do orçamento (API orcamentos)')
      console.error('Erro ao buscar orçamento:', response.status, response.statusText)
      return
    }

    const orcamento = await response.json()
    console.log('Orçamento completo:', orcamento)

    // Usa o cliente já retornado no orçamento
    const cliente = orcamento.cliente
    if (!cliente) {
      alert('Orçamento não possui dados do cliente!')
      console.error('Orçamento retornado sem cliente:', orcamento)
      return
    }
    console.log('Cliente:', cliente)

    // Parsear peças se existirem
    let pecas = []
    if (orcamento.pecas) {
      try {
        pecas = JSON.parse(orcamento.pecas)
      } catch (e) {
        console.error('Erro ao parsear peças:', e)
      }
    }
    const subtotalPecas = pecas.reduce((total: number, peca: any) => total + (peca.valorTotal || 0), 0)
    const formatarMoeda = (valor: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor)
    }
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
        <title>Orçamento #${orcamento.id} - MF ARCONDICIONADO</title>
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
          <h2>ORÇAMENTO #${orcamento.id}</h2>
          <p>Data: ${new Date(orcamento.data).toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="cliente-info">
          <h3>Dados do Cliente:</h3>
          <p><strong>Nome:</strong> ${getNomePrincipal(cliente)}</p>
          <p><strong>${cliente.tipo === 'fisica' ? 'CPF' : 'CNPJ'}:</strong> ${cliente.tipo === 'fisica' ? cliente.cpf || 'N/I' : cliente.cnpj || 'N/I'}</p>
          ${cliente.celular ? `<p><strong>Telefone:</strong> ${cliente.celular}</p>` : ''}
          ${cliente.email ? `<p><strong>E-mail:</strong> ${cliente.email}</p>` : ''}
        </div>
        ${orcamento.descricao ? `
        <div>
          <h3>Descrição do Serviço:</h3>
          <p>${orcamento.descricao}</p>
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
          <p><strong>Mão de Obra:</strong> ${formatarMoeda(orcamento.maoDeObra)}</p>
          <p class="total-geral"><strong>TOTAL GERAL:</strong> ${formatarMoeda(orcamento.valorTotal)}</p>
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

function confirmarDeletarOrcamento(id: number) {
  confirmarId.value = id
  showModal.value = true
}

function apagarOrcamento(id: number | null) {
  if (!id) return
  showModal.value = false
  fetch(`/api/orcamentos/${id}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        orcamentos.value = orcamentos.value.filter(o => o.id !== id)
        mensagem.value = { tipo: 'sucesso', texto: 'Orçamento apagado com sucesso!' }
      } else {
        mensagem.value = { tipo: 'erro', texto: 'Erro ao apagar orçamento. Tente novamente.' }
      }
    })
    .catch(() => {
      mensagem.value = { tipo: 'erro', texto: 'Erro ao apagar orçamento. Tente novamente.' }
    })
    .finally(() => {
      confirmarId.value = null
      setTimeout(() => { mensagem.value = null }, 4000)
    })
}

function parsePecas(pecasStr: string) {
  try {
    return JSON.parse(pecasStr)
  } catch {
    return []
  }
}

async function carregarCliente() {
  const id = route.params.id
  if (id) {
    const res = await fetch(`/api/clientes/${id}`)
    cliente.value = await res.json()
  }
}

async function carregarOrcamentos() {
  const id = route.params.id
  if (id) {
    console.log('Carregando orçamentos para cliente ID:', id)
    try {
      const res = await fetch(`/api/orcamentos/cliente/${id}`)
      if (res.ok) {
        const data = await res.json()
        console.log('Orçamentos carregados:', data)
        orcamentos.value = data
      } else {
        console.error('Erro ao carregar orçamentos:', res.status, res.statusText)
      }
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error)
    }
  }
}

function abrirEditModal(orcamento: Orcamento | null = null) {
  if (orcamento) {
    editOrcamento.value = {
      ...orcamento,
      data: orcamento.data ? orcamento.data.split('T')[0] : ''
    }
    editPecas.value = orcamento.pecas ? JSON.parse(orcamento.pecas) : []
  } else {
    editOrcamento.value = { clienteId: cliente.value.id || 0, data: '', valorTotal: 0, descricao: '', observacoes: '', maoDeObra: 0 }
    editPecas.value = []
  }
  showEditModal.value = true
}

function fecharEditModal() {
  showEditModal.value = false
}

function adicionarEditPeca() {
  editPecas.value.push({ descricao: '', valorUnitario: 0, quantidade: 1, valorTotal: 0 })
}

function removerEditPeca(index: number) {
  editPecas.value.splice(index, 1)
}

async function salvarOrcamentoModal() {
  if (editOrcamento.value.id) {
    // Edição local (pode ser ajustado para PUT na API se desejar)
    const idx = orcamentos.value.findIndex(o => o.id === editOrcamento.value.id)
    if (idx !== -1) {
      orcamentos.value[idx] = {
        ...editOrcamento.value,
        pecas: JSON.stringify(editPecas.value),
        valorTotal: editValorTotalGeral.value,
        data: editOrcamento.value.data // já no formato correto
      } as Orcamento
    }
    showEditModal.value = false
  } else {
    // Criação: enviar para API
    try {
      const res = await fetch('/api/orcamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editOrcamento.value,
          pecas: JSON.stringify(editPecas.value),
          valorTotal: editValorTotalGeral.value,
          clienteId: cliente.value.id
        })
      })
      if (res.ok) {
        await carregarOrcamentos()
        showEditModal.value = false
      } else {
        alert('Erro ao salvar orçamento!')
      }
    } catch (e) {
      alert('Erro ao salvar orçamento!')
    }
  }
}

function abrirEditInlineModal(orcamento: Orcamento) {
  editInlineOrcamento.value = { ...orcamento, data: orcamento.data?.split('T')[0] || '' }
  editInlinePecas.value = orcamento.pecas ? JSON.parse(orcamento.pecas) : []
  showEditInlineModal.value = true
}

function fecharEditInlineModal() {
  showEditInlineModal.value = false
}

function adicionarEditInlinePeca() {
  editInlinePecas.value.push({ descricao: '', valorUnitario: 0, quantidade: 1, valorTotal: 0 })
}

function removerEditInlinePeca(index: number) {
  editInlinePecas.value.splice(index, 1)
}

async function salvarEditInlineOrcamento() {
  if (!editInlineOrcamento.value.id) return
  const id = editInlineOrcamento.value.id
  const res = await fetch(`/api/orcamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...editInlineOrcamento.value,
      pecas: JSON.stringify(editInlinePecas.value),
      valorTotal: editInlineValorTotalGeral.value
    })
  })
  if (res.ok) {
    alert('Orçamento atualizado com sucesso!')
    showEditInlineModal.value = false
    await carregarOrcamentos()
  } else {
    alert('Erro ao atualizar orçamento!')
  }
}

onMounted(() => {
  carregarCliente()
  carregarOrcamentos()
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.badge {
  font-size: 0.8rem;
}

/* Compactar detalhes do cliente */
.card-body, .card-header {
  padding-left: 0.7rem !important;
  padding-right: 0.7rem !important;
}
.card-header {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}
.card-body {
  padding-top: 0.7rem !important;
  padding-bottom: 0.7rem !important;
}
label, .fw-bold, .text-muted {
  font-size: 0.93em !important;
}
h3, h4, h5 {
  font-size: 1.1em !important;
  margin-bottom: 0.5rem !important;
}
.mb-3, .mb-4 {
  margin-bottom: 0.5rem !important;
}

.modal.fade.show.d-block {
  display: block;
  background: rgba(0,0,0,0.4);
  z-index: 1050;
}
</style> 