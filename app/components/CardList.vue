<template>
  <div class="container">
    <div v-if="pending" class="pending-wrapper text-center">
      <div class="msg-pending text-center mt-5 mb-5">Carregando dados, um momento...</div>
      <div class="loading-spinner" aria-hidden="true"></div>
    </div>
    <div v-else-if="error" class="text-center text-danger mt-5">Erro ao carregar notícias</div>
    <div v-else class="row justify-content-center">
      <Card v-for="article in data?.articles" :key="article.url" :article="article" />
    </div>
  </div>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/news', {
  lazy: true,
  server: false
})

</script>

<style scoped>
.container .msg-pending {
  color: #ffffff;
}

.pending-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

  .loading-spinner {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: relative;
    animation: rotate 1s linear infinite
  }
  .loading-spinner::before , .loading-spinner::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #FFF;
    animation: prixClipFix 2s linear infinite ;
  }
  .loading-spinner::after{
    border-color: #FF3D00;
    animation: prixClipFix 2s linear infinite , rotate 0.5s linear infinite reverse;
    inset: 6px;
  }

  @keyframes rotate {
    0%   {transform: rotate(0deg)}
    100%   {transform: rotate(360deg)}
  }

  @keyframes prixClipFix {
    0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
    25%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
    50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
    75%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}
    100% {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}
  }
</style>
