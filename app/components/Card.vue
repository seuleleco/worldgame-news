<template>
  <div class="col-7 col-md-5 col-lg-3 mb-4 mt-5 card-content">
    <div class="card h-100">
      <div class="card-body d-flex flex-column justify-content-center text-center">
        <h5 class="card-title">{{ article.title }}</h5>
      </div>
        <a :href="article.link" class="bt btn-primary" target="_blank">Ler mais...</a>
      <small class="card-date">Data da publicação:</small>
      <small class="card-date">{{ formatDate(article.pubDate) }}</small>
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
.card-content {
  @media (max-width: 475px) {
    margin-left: 50px;
    margin-right: 50px;
  }

  @media (max-width: 400px) {
    margin-left: 60px;
    margin-right: 60px;
  }

  @media (max-width: 360px) {
    margin-left: 70px;
    margin-right: 70px;
  }
}

.card {
  background-image: linear-gradient(#0a2540, #232323);
  max-width: 261px;
  min-width: 250px;
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
  font-size: 12px;
}

.btn-primary{
  color: #7bc3ff;
}

</style>
