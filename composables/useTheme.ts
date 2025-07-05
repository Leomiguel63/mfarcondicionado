export const useTheme = () => {
  const isDark = ref(true) // Tema escuro por padrão

  // Carregar tema do localStorage ao inicializar
  if (process.client) {
    const savedTheme = localStorage.getItem('mf-theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    }
  }

  // Função para alternar tema
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (process.client) {
      localStorage.setItem('mf-theme', isDark.value ? 'dark' : 'light')
    }
  }

  // Aplicar tema ao body
  watch(isDark, (newValue) => {
    if (process.client) {
      // Remover classes anteriores
      document.body.classList.remove('theme-light', 'theme-dark')
      // Adicionar nova classe
      document.body.classList.add(newValue ? 'theme-dark' : 'theme-light')
    }
  }, { immediate: true })

  return {
    isDark: readonly(isDark),
    toggleTheme
  }
} 