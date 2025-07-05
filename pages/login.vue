<template>
  <div class="login-bg">
    <form class="login-card" @submit.prevent="fazerLogin">
      <div class="login-title">
        <span style="color: #e53935; font-weight: bold; font-size: 2.3rem; letter-spacing: 2px;">MF</span><span style="color: #1976d2; font-weight: bold; font-size: 2.3rem; margin-left: 4px; letter-spacing: 2px;">ARCONDICIONADO</span>
      </div>
      <div class="form-group">
        <label for="usuario">Usuário</label>
        <input id="usuario" v-model="usuario" type="text" class="form-control" placeholder="Digite seu usuário" autocomplete="username" />
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input id="senha" v-model="senha" type="password" class="form-control" placeholder="Digite sua senha" autocomplete="current-password" />
      </div>
      <button type="submit" class="btn-login">Entrar</button>
      <div v-if="erro" class="login-erro">Usuário ou senha incorretos.</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const usuario = ref('')
const senha = ref('')
const erro = ref(false)
const router = useRouter()

function fazerLogin() {
  if (usuario.value === 'Karina' && senha.value === 'mf.@2025') {
    localStorage.setItem('usuarioLogado', 'true')
    erro.value = false
    router.push('/')
  } else {
    erro.value = true
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.login-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px #0002;
  padding: 2.5rem 2.2rem 2rem 2.2rem;
  min-width: 320px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin-top: 8vh;
}
.login-title {
  font-family: 'Inter', Arial, sans-serif;
  font-size: 2.3rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 1.2rem;
  user-select: none;
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}
.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}
.form-group label {
  font-size: 1rem;
  color: #1976d2;
  font-weight: 600;
}
.form-control {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #b0bec5;
  font-size: 1.1rem;
  background: #f8f9fa;
  color: #333;
  outline: none;
  transition: border 0.2s;
}
.form-control:focus {
  border: 1.5px solid #1976d2;
  background: #fff;
}
.btn-login {
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.8rem 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #1976d2 60%, #e53935 100%);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 4px 16px #1976d233;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-login:hover {
  background: linear-gradient(90deg, #1565c0 60%, #e53935 100%);
  transform: translateY(-2px) scale(1.03);
}
.login-erro {
  color: #e53935;
  font-size: 1rem;
  margin-top: 0.5rem;
  font-weight: 600;
  text-align: center;
}
@media (max-width: 500px) {
  .login-card {
    min-width: 90vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    margin-top: 4vh;
  }
  .login-title {
    font-size: 1.3rem;
  }
}
</style> 