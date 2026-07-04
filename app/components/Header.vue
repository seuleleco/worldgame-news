<template>
  <header>
    <div class="headerContainer d-flex align-items-center justify-content-center gap-3 mb-5">
      <h1 class="site-title">{{ title }}</h1>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const { data: settings } = useFetch('/api/site-settings')

const title = computed(() => {
  return settings.value?.settings?.content?.['hero.title'] || 'World Game News'
})
</script>

<style>
.headerContainer {
  background: linear-gradient(aqua);
  min-height: auto;
  padding: 10px;
  min-width: 100vw;
  margin: 0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.site-title {
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
}

</style>