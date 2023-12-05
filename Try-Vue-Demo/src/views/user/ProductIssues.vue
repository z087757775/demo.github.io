<script>
import { ref } from 'vue'

export default {
  setup() {
    const activeSection = ref(0)
    const toggleSection = (index) => {
      if (activeSection.value === index) {
        // 如果點擊的是已經打開的面板，則關閉面板
        activeSection.value = 0
      } else {
        // 否則，打開點擊的面板
        activeSection.value = index
      }
    }

    return {
      activeSection,
      toggleSection
    }
  }
}
</script>
<template>
  <div class="head">
    <div class="common-problem">
      <p>常見問題</p>
    </div>
    <button
      @click="toggleSection(1)"
      :class="[
        activeSection === 1 ? 'openup' : 'opendown',
        activeSection === 1 ? 'button-active' : ''
      ]"
      class="button"
    >
      <span>1.</span>如何購買商品？
    </button>
    <transition name="fade1" mode="out-in">
      <div v-if="activeSection === 1" class="section-content" key="section-1">
        <ul>
          <li>在喜歡的商品點擊購買</li>
          <li>在購物車確認您選擇的產品與數量</li>
        </ul>
      </div>
    </transition>
    <button
      @click="toggleSection(2)"
      :class="[
        activeSection === 2 ? 'openup' : 'opendown',
        activeSection === 2 ? 'button-active' : ''
      ]"
      class="button"
    >
      <span>2.</span>有哪些配送方式呢？
    </button>
    <transition name="fade1" mode="out-in">
      <div v-if="activeSection === 2" class="section-content" key="section-2">
        <ul>
          <li>商品未滿1000元整，運費60元</li>
          <li>商品金額到達1000元(含)，免運費</li>
        </ul>
      </div>
    </transition>
    <button
      @click="toggleSection(3)"
      :class="[
        activeSection === 3 ? 'openup' : 'opendown',
        activeSection === 3 ? 'button-active' : ''
      ]"
      class="button"
    >
      <span>3.</span>請問可以冷藏或冷凍嗎？ 如何保存呢？
    </button>
    <transition name="fade1" mode="out-in">
      <div v-if="activeSection === 3" class="section-content" key="section-3">
        <ul>
          <li>有水果商品建議到貨當天享用完畢，冷藏可存放2天</li>
          <li>沒有水果的產品一律可以冷凍保存半個月，冷藏3天</li>
          <li>常溫產品一律在室溫底下，太陽不曝曬情況下，2天賞味期</li>
        </ul>
      </div>
    </transition>
    <button
      @click="toggleSection(4)"
      :class="[
        activeSection === 4 ? 'openup' : 'opendown',
        activeSection === 4 ? 'button-active' : ''
      ]"
      class="button"
    >
      <span>4.</span>請問冷凍的商品如何解凍呢？
    </button>
    <transition name="fade1" mode="out-in">
      <div v-if="activeSection === 4" class="section-content" key="section-4">
        <ul>
          <li>冷凍解凍，只需放在冷藏隔夜解凍，隔日即可品嚐，存放建議3天</li>
          <li>冷凍解凍商品，不建議來回冷凍冷藏，容易發霉</li>
        </ul>
      </div>
    </transition>
    <button
      @click="toggleSection(5)"
      :class="[
        activeSection === 5 ? 'openup' : 'opendown',
        activeSection === 5 ? 'button-active' : ''
      ]"
      class="button"
    >
      <span>5.</span>請問可以退貨嗎？ 大小不符合期望可以退貨嗎？
    </button>
    <transition name="fade1" mode="out-in">
      <div v-if="activeSection === 5" class="section-content" key="section-5">
        <ul>
          <li>很抱歉，生鮮食品類商品售出後 不享有鑑賞期及退換貨服務</li>
          <li>
            （自 105 年 1 月 1 日起，生鮮食品類不適用於消費者保護法第 19 條，不享有 7 天鑑賞期）
          </li>
          <li>請謹慎評估後再購買</li>
        </ul>
      </div>
    </transition>
    <div></div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.head {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.common-problem {
  position: relative;
  display: inline-block;
  padding: 0 60px;
  margin-bottom: 40px;
  font-size: 36px;
}

.common-problem::before,
.common-problem::after {
  content: '';
  position: absolute;
  width: calc(36% - 50px);
  height: 3px;
  background: #ccc;
  top: 50%;
  transform: translateY(-70%);
}

.common-problem::before {
  left: 0;
}

.common-problem::after {
  right: 0;
}

button {
  position: relative;
  width: 50%;
  height: 40px;
  padding-left: 10px;
}

.opendown::after {
  content: url('https://api.iconify.design/raphael/arrowdown.svg?color=darkgray');
  position: absolute;
  top: 10px;
  right: 8px;
  line-height: 40px;
  transform: scale(1.5);
}

.openup::after {
  content: url('https://api.iconify.design/raphael/arrowup.svg?color=darkgray');
  position: absolute;
  top: 10px;
  right: 8px;
  line-height: 40px;
  transform: scale(1.5);
}

.button {
  display: flex;
  height: 100%;
  font-size: 30px;
  border: 2px solid #ccc;
  padding: 20px 0 20px 10px;
  margin-top: 10px;
  cursor: pointer;
}

.button:hover {
  background-color: #ccc;
}

.button-active {
  background-color: #ccc;
}

.section-content {
  width: 50%;
  height: 100%;
  border: 2px solid #ccc;
  border-top: none;
  padding: 0 0 20px 30px;
}

li {
  margin-top: 20px;
  font-size: 20px;
}

.fade1-enter-active,
.fade1-leave-active {
  transition:
    transform 0.6s ease-in-out 0s,
    opacity 0.6s ease-in-out 0s;
}
.fade1-enter,
.fade1-leave-to {
  transform: translateY(-10%);
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}
</style>
