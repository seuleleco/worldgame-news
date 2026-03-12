<template>
  <div class="col-7 col-md-5 col-lg-3 mb-4 mt-5 card-content">
    <div
        ref="cardRef"
        class="card h-100"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        :style="cardStyle"
    >
      <div v-if="article.image" class="card-image">
        <img :src="article.image" :alt="article.title"/>
      </div>
      <div class="card-body d-flex flex-column justify-content-center text-center">
        <h5 class="card-title">{{ article.title }}</h5>
      </div>
      <a :href="article.url" class="bt btn-primary mb-4" target="_blank">Ler mais...</a>
      <small class="card-date">{{ formatDate(article.pubDate) }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineProps({
  article: {
    type: Object,
    required: true
  }
})

const cardRef = ref(null);
const rotateX = ref(0);
const rotateY = ref(0);
const isHovered = ref(false);

const cardStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
  boxShadow: isHovered.value ? '0 20px 40px rgba(5, 242, 179, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.1s ease, box-shadow 0.1s ease'
}));

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  rotateY.value = (x - centerX) / 10;
  rotateX.value = (centerY - y) / 10;
  isHovered.value = true;
};

const handleMouseLeave = () => {
  rotateX.value = 0;
  rotateY.value = 0;
  isHovered.value = false;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
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

.card-image {
  width: 100%;
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-date {
  color: #e5e7eb;
  font-style: italic;
  font-size: 12px;
  position: absolute;
  bottom: 7px;
}

.btn-primary {
  color: #7bc3ff;
}
</style>
