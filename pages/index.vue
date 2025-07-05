<template>
  <div class="container-fluid home" style="padding-top: 120px; min-height: calc(100vh - 120px);">
    <span class="brand-home">
      <span class="brand-mf">MF</span><span class="brand-ar">ARCONDICIONADO</span>
    </span>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  background-color: #f8f9fa !important;
  box-sizing: border-box;
}
.brand-home {
  display: flex;
  align-items: center;
  font-family: 'Inter', Arial, sans-serif;
  font-size: 4.2rem;
  font-weight: bold;
  letter-spacing: 2px;
  user-select: none;
  text-shadow: 0 4px 16px #0002, 0 1px 0 #1976d2;
}
.brand-mf {
  color: #e53935;
}
.brand-ar {
  color: #1976d2;
  margin-left: 12px;
}
@media (max-width: 600px) {
  .brand-home {
    font-size: 2.2rem;
  }
  .brand-ar {
    margin-left: 6px;
  }
}
/* Modo night: fundo preto */
.theme-dark .home {
  background: #000 !important;
  background-color: #000 !important;
}
</style> 