<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top" :class="isDark ? 'theme-dark' : 'theme-light'" style="border-bottom: 4px solid #1976d2; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 99999; backdrop-filter: blur(10px);">
    <div class="container">
      <NuxtLink to="/" class="navbar-brand d-flex align-items-center" style="text-decoration: none; margin-left: 2.5rem;">
        <i class="bi bi-fan me-2" style="color: #6c757d; font-size: 1.5rem;"></i>
        <span class="fw-bold fs-4">
          <span style="color: #e53935;">MF</span><span style="color: #1976d2; margin-left: 4px;">ARCONDICIONADO</span>
        </span>
      </NuxtLink>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" style="margin-left: 3.5rem;">
          <li class="nav-item">
            <NuxtLink to="/clientes" class="nav-link d-flex align-items-center">
              <i class="bi bi-person me-2"></i> Cadastro de Clientes
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/clientes-lista" class="nav-link d-flex align-items-center">
              <i class="bi bi-list-ul me-2"></i> Lista de Clientes
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/pecas" class="nav-link d-flex align-items-center">
              <i class="bi bi-puzzle-piece me-2"></i> Cadastro de Estoque
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/pecas-lista" class="nav-link d-flex align-items-center">
              <i class="bi bi-list-ul me-2"></i> Lista de Estoque
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/orcamento" class="nav-link d-flex align-items-center">
              <i class="bi bi-currency-dollar me-2"></i> Novo Orçamento
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/orcamentos-lista" class="nav-link d-flex align-items-center">
              <i class="bi bi-journal-text me-2"></i> Lista de Orçamentos
            </NuxtLink>
          </li>
        </ul>
        <ul class="navbar-nav flex-row align-items-center" style="gap:0.5rem; margin-left:1.5rem;">
          <li class="nav-item dropdown d-flex align-items-center" v-if="usuario" style="position: relative;">
            <button @click="mostrarDropdown = !mostrarDropdown" class="btn btn-link p-0 m-0 fw-bold text-primary d-flex align-items-center" style="font-size: 1rem; text-decoration: none;">
              <i class="bi bi-person-circle me-1"></i>{{ usuario }}
              <i class="bi bi-caret-down-fill ms-1" style="font-size:0.9em;"></i>
            </button>
            <ul v-if="mostrarDropdown" class="dropdown-menu show" style="position: absolute; right: 0; top: 110%; min-width: 120px;">
              <li>
                <button class="dropdown-item text-danger" @click="logout">Sair</button>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <button @click="toggleTheme" class="btn btn-outline-light btn-sm d-flex align-items-center" title="Alternar Tema">
              <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'" style="font-size: 1.1rem;"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const { isDark, toggleTheme } = useTheme()
const router = useRouter()

const usuario = ref('')
const totalOrcamentos = ref(0)
const valorGeral = ref(0)
const mostrarDropdown = ref(false)

onMounted(async () => {
  usuario.value = localStorage.getItem('usuarioNome') || 'Karina'
  // Buscar orçamentos e calcular totais
  try {
    const res = await fetch('/api/orcamentos')
    if (res.ok) {
      const orcamentos = await res.json()
      totalOrcamentos.value = orcamentos.length
      valorGeral.value = orcamentos.reduce((soma: number, o: any) => soma + (o.valorTotal || 0), 0)
    }
  } catch {}
  // Fecha dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.nav-item.dropdown')) {
      mostrarDropdown.value = false
    }
  })
})

function logout() {
  localStorage.removeItem('usuarioLogado')
  localStorage.removeItem('usuarioNome')
  router.push('/login')
}

// Bootstrap icons via CDN
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css'
    }
  ]
})
</script>

<style scoped>
.theme-dark {
  background: linear-gradient(135deg, #000 0%, #1a1a1a 100%) !important;
  background-color: #000 !important;
}

.theme-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  background-color: #f8f9fa !important;
  color: #333;
}

/* Garantir que a navbar não seja transparente */
.navbar {
  background: inherit !important;
  position: fixed !important;
  top: 0 !important;
  width: 100% !important;
  z-index: 99999 !important;
}

/* Fundo sólido para o container da navbar */
.navbar .container {
  background: inherit !important;
  padding-left: 0;
  padding-right: 12px;
  margin: 0;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
}

.navbar-nav .nav-link {
  color: #fff !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  font-size: 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.theme-light .navbar-nav .nav-link {
  color: #333 !important;
}

.navbar-nav .nav-link:hover {
  background-color: #1976d2 !important;
  color: #fff !important;
  transform: translateY(-2px);
}

.navbar-nav .nav-link.router-link-active {
  background-color: #e53935 !important;
  color: #fff !important;
}

.navbar-brand {
  font-family: 'Inter', Arial, sans-serif;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}

.btn-outline-light {
  border-color: rgba(255,255,255,0.5);
  color: #fff;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.theme-light .btn-outline-light {
  border-color: rgba(0,0,0,0.3);
  color: #333;
}

.btn-outline-light:hover {
  background-color: #1976d2;
  border-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.nav-item.ms-2 {
  margin-left: 1.2rem !important;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 1rem;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .navbar-nav .nav-link {
    margin: 0.25rem 0;
    padding: 0.5rem 1rem;
    white-space: normal;
  }
  .nav-item.ms-2 {
    margin-left: 0.5rem !important;
  }
}

.menu-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  background-color: #f9f9f9;
  overflow-x: auto;
}

.logo {
  font-weight: bold;
  color: #d32f2f;
  white-space: nowrap;
}

.menu-links {
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
}

.theme-dark .dropdown-menu, .dropdown-menu {
  min-width: 90px !important;
  padding: 0.25rem 0.5rem !important;
  font-size: 0.95rem !important;
  border-radius: 8px !important;
}

.theme-dark .dropdown-item, .dropdown-item {
  padding: 0.3rem 0.7rem !important;
  font-size: 0.97rem !important;
}
</style> 