<template>
  <div class="col-md-4 col-lg-3 mb-4">
    <div class="card h-100">
      <div class="card-body d-flex flex-column justify-content-center text-center">
      <h5 class="card-title">{{ article.title }}</h5>
      <a :href="article.link" class="bt btn-primary" target="_blank">Ler mais...</a>
      <small class="text-muted mt-2">{{ formatDate(article.pubDate) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

</script>

<style scoped>
.card {
  width: 250px;
  height: 250px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

</style>
