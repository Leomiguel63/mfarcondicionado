<template>
  <div class="os-container">
    <h1>Nova Ordem de Serviço</h1>
    <form @submit.prevent="salvarOS">
      <section class="secao">
        <h2>Dados do Cliente e Veículo</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Nome do Cliente</label>
            <input v-model="os.cliente" type="text" required />
          </div>
          <div class="form-group">
            <label>Carro/Modelo/Placa</label>
            <input v-model="os.carro" type="text" required />
          </div>
        </div>
      </section>
      <section class="secao">
        <h2>Descrição do Serviço</h2>
        <div class="form-group">
          <textarea v-model="os.descricao" required placeholder="Descreva o serviço realizado..."></textarea>
        </div>
      </section>
      <section class="secao">
        <h2>Peças Utilizadas</h2>
        <div class="form-group">
          <div v-for="(peca, i) in os.pecas" :key="i" class="peca-item">
            <input v-model="peca.nome" placeholder="Nome da peça" required />
            <input v-model.number="peca.quantidade" type="number" min="1" placeholder="Qtd" required />
            <input v-model.number="peca.valor" type="number" min="0" step="0.01" placeholder="Valor" required />
            <button type="button" @click="removerPeca(i)">Remover</button>
          </div>
          <button type="button" class="add-btn" @click="adicionarPeca">Adicionar Peça</button>
        </div>
      </section>
      <section class="secao">
        <h2>Mão de Obra</h2>
        <div class="form-group">
          <div v-for="(mao, i) in os.maoDeObra" :key="i" class="mao-item">
            <input v-model="mao.descricao" placeholder="Descrição" required />
            <input v-model.number="mao.valor" type="number" min="0" step="0.01" placeholder="Valor" required />
            <button type="button" @click="removerMao(i)">Remover</button>
          </div>
          <button type="button" class="add-btn" @click="adicionarMao">Adicionar Serviço</button>
        </div>
      </section>
      <button type="submit" class="salvar-btn">Salvar OS</button>
      <div v-if="sucesso" class="sucesso-msg">Ordem de Serviço salva!</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

interface Peca {
  nome: string
  quantidade: number
  valor: number
}

interface MaoDeObra {
  descricao: string
  valor: number
}

const os = reactive({
  cliente: '',
  carro: '',
  descricao: '',
  pecas: [] as Peca[],
  maoDeObra: [] as MaoDeObra[],
})
const sucesso = ref(false)

function adicionarPeca() {
  os.pecas.push({ nome: '', quantidade: 1, valor: 0 })
}
function removerPeca(i: number) {
  os.pecas.splice(i, 1)
}
function adicionarMao() {
  os.maoDeObra.push({ descricao: '', valor: 0 })
}
function removerMao(i: number) {
  os.maoDeObra.splice(i, 1)
}
function salvarOS() {
  sucesso.value = true
  setTimeout(() => sucesso.value = false, 2000)
  // Aqui você pode enviar os dados para uma API ou salvar localmente
}
</script>

<style scoped>
.os-container {
  max-width: 700px;
  margin: 3.5rem auto 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px #0002;
}
h1 {
  color: #2d3748;
  margin-bottom: 1.2rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.secao {
  margin-bottom: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1.5px solid #e2e8f0;
}
.secao:last-child {
  border-bottom: none;
}
h2 {
  color: #3182ce;
  font-size: 1.15rem;
  margin-bottom: 0.7rem;
  font-weight: 700;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.form-group {
  flex: 1;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
input, textarea {
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  margin-top: 0.2rem;
  transition: border 0.2s;
}
input:focus, textarea:focus {
  border: 1.5px solid #63b3ed;
  outline: none;
}
.peca-item, .mao-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.add-btn {
  background: #3182ce;
  color: #fff;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #63b3ed;
}
.salvar-btn {
  margin-top: 1.2rem;
  font-size: 1.1rem;
  background: #38a169;
  color: #fff;
  padding: 0.7rem 2rem;
  border-radius: 8px;
  font-weight: 700;
}
.salvar-btn:hover {
  background: #2f855a;
}
.sucesso-msg {
  margin-top: 0.7rem;
  color: #38a169;
  background: #e6fffa;
  border: 1px solid #38a169;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  font-size: 1rem;
  text-align: center;
}
@media (max-width: 700px) {
  .form-row {
    flex-direction: column;
  }
  .os-container {
    padding: 1rem;
  }
  .secao {
    padding-bottom: 0.5rem;
  }
}
</style> 