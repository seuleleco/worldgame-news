<template>
  <div class="container">
    <div v-if="pending" class="text-center">Carregando...</div>
    <div v-else-if="error" class="text-center text-danger">Erro ao carregar notícias</div>
    <div v-else class="row justify-content-center">
      <Card v-for="article in data?.articles" :key="article.link" :article="article" />
    </div>
  </div>
</template>


<script setup>
const { data, pending, error } = await useFetch('/api/news')

</script>

<style lang="scss" scoped>

</style>