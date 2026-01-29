<template>
  <div>
    <div>{{ response }}</div>
  </div>
</template>

<script setup>
const response = await useFetch('/api/news');

</script>

<style>

</style>