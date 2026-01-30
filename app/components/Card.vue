<template>
  <div class="col-7 col-md-5 col-lg-3 mb-4 mt-5 card-content">
    <div class="card h-100">
      <small class="card-date">Data de publicação:</small>
      <small class="mb-1 card-date">{{ formatDate(article.pubDate) }}</small>
      <div class="card-body d-flex flex-column justify-content-center text-center">
        <h5 class="card-title">{{ article.title }}</h5>
      </div>
        <a :href="article.link" class="bt btn-primary" target="_blank">Ler mais...</a>

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
  background-image: linear-gradient(#0a2540);
  max-width: 261px;
 /* border: 1px solid aqua;*/
  border-radius: 15px;
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
  color: white;
}

.card-content {
  margin-left: 20px;

}

.card-date {
  color: #e5e7eb ;
  font-style: italic;
}

.btn-primary{
  color: #7bc3ff;
}

</style>
