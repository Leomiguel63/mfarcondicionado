export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const logado = localStorage.getItem('usuarioLogado') === 'true'
    if (!logado && to.path !== '/login') {
      return navigateTo('/login')
    }
    if (logado && to.path === '/login') {
      return navigateTo('/')
    }
  }
}) 