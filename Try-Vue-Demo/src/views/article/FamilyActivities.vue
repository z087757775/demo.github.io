<script>
export default {
  setup() {
    const bakeDiy = [
      {
        id: 1,
        title: '家長與小朋友一起動手做曲奇餅乾',
        url: '/src/photo/bake_diy/bake-diy1.jpeg',
        alt: '烘焙親子DIY'
      },
      {
        id: 2,
        title: '小朋友獨自完成一顆屬於自己的凱蒂貓蛋糕',
        url: '/src/photo/bake_diy/bake-diy2.jpeg',
        alt: '烘焙親子DIY'
      },
      {
        id: 3,
        title: '老師手把手，教導小朋友玩成一顆生日蛋糕',
        url: '/src/photo/bake_diy/bake-diy3.jpeg',
        alt: '烘焙親子DIY'
      },
      {
        id: 4,
        title: '家長與小朋友，看著平板上的烘焙教學，一起動手同樂',
        url: '/src/photo/bake_diy/bake-diy4.jpeg',
        alt: '烘焙親子DIY'
      }
    ]

    return {
      bakeDiy
    }
  }
}
</script>

<template>
  <div class="main-layout">
    <div class="content">
      <div class="diy">
        <h2>烘焙親子DIY</h2>
      </div>
      <h3>前言</h3>
      <p>
        烘焙親子 DIY
        是一場充滿樂趣和甜美回憶的活動，不僅能夠讓親子之間的關係更親近，還可以培養孩子的動手能力和創造力，
      </p>
      <p>
        從簡單的曲奇餅乾到精緻的蛋糕，每一道點心都將成為您和孩子的共同創作，讓您和孩子一同參與烹飪，並在過程中創造美味的點心和糕點。
      </p>
    </div>
    <div class="photo-grid">
      <div v-for="(photo, index) in bakeDiy" :key="index" class="photo-item">
        <p class="photo-title">{{ photo.title }}</p>
        <img :src="photo.url" :alt="photo.alt" style="max-width: 400px; max-height: 400px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.main-layout {
  margin: 20px 30px;
  text-align: center;
}
.content {
  padding-top: 30px;
}

.content h2,
h3,
p {
  margin-bottom: 10px;
}

.content p:last-child {
  border-bottom: 2px solid #ccc;
  padding-bottom: 20px;
}

.diy {
  position: relative;
  display: inline-block;
  padding: 0 60px;
  margin-bottom: 40px;
  font-size: 22px;
}

.diy::before,
.diy::after {
  content: '';
  position: absolute;
  width: calc(36% - 65px);
  height: 3px;
  background: #ccc;
  top: 40%;
  transform: translateY(-70%);
}

.diy::before {
  left: 0;
}

.diy::after {
  right: 0;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 80px;
}

.photo-item {
  position: relative;
  width: calc(50% - 10px);
  margin-bottom: 80px;
}

.photo-title {
  position: absolute;
  top: -26px;
  left: 0;
  width: 100%;
  text-align: center;
}

.photo-title::before {
  content: '';
  background-image: url('/src/photo/bake_diy/Egg-beater.png');
  background-size: contain;
  width: 20px;
  height: 20px;
  display: inline-block;
}
</style>
