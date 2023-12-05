<script>
import { useStore } from 'vuex'
import { elementPlusComponents, elementPlusIcons } from '@/store/elementPlusComponents'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const user = ref(store.state.user)

    const selectedProductCount = computed(() => {
      return store.state.selectedProductCount
    })

    const showShoppingCart = ref(false)

    const toggleShoppingCart = () => {
      showShoppingCart.value = !showShoppingCart.value
    }

    const login = async () => {
      try {
        router.push('/login')
      } catch (error) {
        console.error('登出失败:', error)
      }
    }

    const logout = () => {
      // 調用 store 的 logout action
      store.dispatch('logout')
      user.value = null
      router.push('/login')
    }

    return {
      user,
      login,
      logout,
      showShoppingCart,
      toggleShoppingCart,
      selectedProductCount,
      ...elementPlusComponents,
      ...elementPlusIcons
    }
  }
}
</script>
<template>
  <div id="common-layout">
    <el-container>
      <el-header id="header-content" style="background-color: #c4c4c4">
        <div id="header-content">
          <div class="left-section">
            <img src="/src/photo/logo.png" alt="甜鹿烘焙坊的 Logo" />
            <img src="/src/photo/font.png" alt="甜鹿烘焙坊的 font" />
          </div>
          <div class="search-box">
            <input type="text" placeholder="搜尋商品" />
            <button></button>
          </div>
          <div class="right-section">
            <router-link to="/article/showcart">
              <i class="fa-shopping-cart" @click="toggleShoppingCart"></i>
            </router-link>
            <div>
              <!-- 購物圖標 -->
              <span v-if="selectedProductCount > 0" class="selected-product-count">
                {{ selectedProductCount }}
              </span>
            </div>

            <div v-if="user" class="user-info">
              <!-- 用戶已登入，顯示用戶名和登出鍵 -->
              <span>{{ user.email.split('@')[0] }}用戶,歡迎您！</span>
              <button @click="logout">登出</button>
            </div>
            <div v-else>
              <!-- 用戶為登入，顯示登入鍵 -->
              <transition name="fade" mode="out-in">
                <button @click="login">立即登入</button>
              </transition>
            </div>
          </div>
        </div>
      </el-header>
      <el-container>
        <div class="flex-container">
          <el-aside class="asid-layout aside-layout">
            <el-card class="box-card">
              <router-link to="/article/manage">
                <div>全部商品</div>
              </router-link>
              <router-link to="/article/channel">
                <div>親子DIY</div>
              </router-link>
              <router-link to="/user/profile">
                <div>常見問題</div>
              </router-link>
              <router-link to="/user/avatar">
                <div>關於我們</div>
              </router-link>
            </el-card>
          </el-aside>
          <el-container>
            <el-main>
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-main>
          </el-container>
        </div>
      </el-container>
    </el-container>
    <el-footer class="footer-layout">
      <div>
        <h3>個人聲明</h3>
        <p>- 此作品僅為練習使用，無商業用途。</p>
        <p>- 所使用圖片皆為免費資源。</p>
        <p>- 如不小心誤觸版權圖片，請聯絡我。</p>

        <a href="mailto:z087757775@yahoo.com.tw" style="font-weight: 800"
          >z087757775@yahoo.com.tw</a
        >
      </div>
    </el-footer>
  </div>
</template>

<style scoped>
.el-main {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-family: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
  z-index: 1;
}

a,
input {
  text-decoration: none;
  color: black;
  outline: none;
}

#common-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  height: auto;
  margin: 0;
  padding: 0;
  min-height: 50rem;
}

#common-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #f5f5f5, #edeef0);
  opacity: 0.5;
  z-index: -1;
}

#common-layout #header-content {
  position: sticky;
  top: 0;
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  z-index: 9999;
}

#common-layout .el-header .search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 25%;
  height: 1.875rem;
}

#common-layout .el-header .search-box input {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  background: url('/src/photo/logo.png') no-repeat center center;
  background-size: 20px 20px;
  background-position: 0.3125rem center;
  border-radius: 2.625rem;
  padding: 0 0 0 1.875rem;
}

#common-layout .el-header .search-box::before {
  content: '';
  position: absolute;
  left: 28px;
  top: 0;
  bottom: 0;
  width: 0.0625rem;
  background-color: black;
  height: 100%;
}

#common-layout .el-header .search-box button {
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
  height: 100%;
  background: url('https://api.iconify.design/ep/search.svg') no-repeat center center;
  color: white;
  border: none;
  padding: 0 1.25rem;
  cursor: pointer;
}

#common-layout .el-header #header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

#common-layout .left-section {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0;
  left: auto;
  text-align: left;
}

#common-layout .left-section img {
  width: 3.125rem;
  height: 3.125rem;
  margin-right: 0.625rem;
}

#common-layout .left-section img:last-child {
  width: auto;
  height: auto;
  margin-right: 0;
}
#common-layout .right-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

#common-layout .right-section .user-info {
  background: linear-gradient(to bottom, #f0f8ff, #909fa6);
  color: #a0522d;
  padding: 0.3125rem 0.625rem;
  border-radius: 2.625rem;
  box-shadow: 0.1875rem 0.125rem 0.3125rem rgba(0, 0, 0, 1);
  font-family: 'Kanit', sans-serif;
  font-size: 0.875rem;
}

.fa-shopping-cart {
  position: relative;
  background: url('https://api.iconify.design/ph/shopping-cart-simple-fill.svg?color=sienna')
    no-repeat center center / contain;
  padding: 0.625rem;
  margin: 0 1.25rem 0 0.3125rem;
  cursor: pointer;
}

.selected-product-count {
  position: absolute;
  min-width: 1.25rem;
  height: 1.25rem;
  background-color: red;
  border-radius: 50%;
  top: 0.4375rem;
  right: 11%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.75rem;
  transform-origin: center;
  transform: scale(1);
  transition: transform 0.2s ease;
}

#common-layout .right-section button {
  font-family: 'Kanit', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  background: transparent;
  color: #a0522d;
  cursor: pointer;
  margin-left: 0.625rem;
}

#common-layout .flex-container {
  width: 100%;
  display: flex;
  flex-grow: 1;
  position: relative;
}

#common-layout .flex-sidebar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.router-link-active {
  color: #778899;
  text-shadow: 0.1875rem 0.125rem 0.3125rem rgba(196, 196, 196, 0.376);
  text-decoration: underline;
  font-weight: 700;
}
#common-layout .asid-layout {
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.875rem;
  overflow-y: auto;
}

#common-layout .asid-layout .box-card {
  width: auto;
  background-color: transparent;
  box-shadow: none;
  border: none;
  margin-right: 1.25rem;
}

#common-layout .asid-layout .box-card div {
  width: 9.375rem;
  border: 1px solid #ccc;
  margin-top: 1.25rem;
  padding: 1.125rem 0;
  border-radius: 30%;
  box-shadow: 0.1875rem 0.125rem 0.3125rem rgba(0, 0, 0, 1);
  font-family: 'Kanit', sans-serif;
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
}

#common-layout .footer-layout {
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  box-sizing: border-box;
  height: auto;
  font-family: 'Kanit', sans-serif;
}

#common-layout .footer-layout p {
  text-align: left;
}

#common-layout .footer-layout a::before {
  content: '';
  display: inline-block;
  width: 1.5625rem;
  height: 1.5625rem;
  background: url('https://api.iconify.design/ep/comment.svg') no-repeat center center;
  background-size: 1.5625rem 1.5625rem;
  vertical-align: middle;
  margin-right: 0.3125rem;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-1.875rem);
}

.fade-enter-active {
  transition: all 1s ease-out;
}

.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-leave-active {
  transition: all 3s ease-in;
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
