<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { photoArray, photoArray2 } from './commodity'
import ProductPopup from '@/views/article/ProductPopup.vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

export default {
  components: {
    ProductPopup
  },
  setup() {
    const store = useStore()

    // 輪播圖
    const combinedArray = ref([...photoArray, ...photoArray2].slice(0, 5))
    // 存儲隨機圖片
    const randomImages = ref([])
    // 顯示商品名
    const currentIndex = ref(null)
    // 購物車
    const cart = ref([])
    // 特價商品
    const discountedCart = ref([])
    // 結帳總價
    const checkoutTotal = ref(0)
    // 購物車總價
    const cartRefs = ref(cart)
    // 刪除對話框
    const showConfirmation = ref(false)
    // 刪除商品索引
    const deleteIndex = ref(-1)
    // 刪除商品名
    const deletedProductName = ref('')
    // 更新選擇的商品數量
    const updateSelectedProductCount = () => {
      const selectedProductCount = cart.value.reduce((total, product) => {
        return total + product.quantity
      }, 0)

      const discountedProductCount = discountedCart.value.reduce((total, product) => {
        return total + product.quantity
      }, 0)

      store.commit('updateSelectedProductCount', selectedProductCount + discountedProductCount)
    }

    // 計算購物車總價
    const cartTotal = computed(() => {
      let total = 0

      cartRefs.value.forEach((product) => {
        total +=
          product.quantity *
          (product.priceType === 'discounted' ? product.discountedPrice : product.originalPrice)
      })

      discountedCart.value.forEach((product) => {
        total += product.quantity * product.price
      })

      return total
    })

    // 顯示確認對話框
    const showDeleteConfirmation = (index) => {
      showConfirmation.value = true
      deleteIndex.value = index

      if (index < cart.value.length) {
        deletedProductName.value = cart.value[index].name
      } else if (index < cart.value.length + discountedCart.value.length) {
        const discountedIndex = index - cart.value.length
        deletedProductName.value = discountedCart.value[discountedIndex].name
      } else {
        deletedProductName.value = ''
      }
    }

    // 組件掛載時，將購物車中的商品添加到 cart 和 discountedCart 中
    const initializeCart = () => {
      // 清空购物车和特价商品数组
      cart.value = []
      discountedCart.value = []
      checkoutTotal.value = calculateCheckoutTotal()

      store.commit('setSelectedProductCount', store.state.selectedProductCount)
      // 初始化购物车数据，包括原价商品和特价商品
      store.state.cart.forEach((product) => {
        const parsedProduct = {
          ...product,
          id: product.id,
          name: product.name,
          originalPrice: parseFloat(product.originalPrice),
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity)
        }

        if (product.priceType === 'discounted') {
          parsedProduct.discountedPrice = parseFloat(product.discountedPrice)
          if (isNaN(parsedProduct.discountedPrice)) {
            parsedProduct.discountedPrice = parsedProduct.originalPrice * parsedProduct.quantity
          }
          if (isNaN(parsedProduct.quantity)) {
            parsedProduct.quantity = 0
          }
          parsedProduct.id = product.id
          parsedProduct.name = product.name
          discountedCart.value.push(parsedProduct)
        } else {
          cart.value.push(parsedProduct)
        }
      })

      checkoutTotal.value = calculateCheckoutTotal()
    }

    onMounted(initializeCart)

    //路由切換前，保存購物車數據
    const beforeRouteLeave = () => {
      const cartData = {
        discountedCart: discountedCart.value,
        cart: cart.value
      }
      store.commit('setCart', cartData)
    }

    //路由切換後，加載購物車數據
    const beforeRouteUpdate = () => {
      initializeCart()
    }

    onBeforeRouteLeave(beforeRouteLeave)

    onBeforeRouteUpdate(beforeRouteUpdate)

    // 確認刪除
    const confirmDelete = () => {
      if (deleteIndex.value >= 0) {
        // 从购物车 cart 中删除当前的商品
        if (deleteIndex.value < cart.value.length) {
          removeProduct(deleteIndex.value)
          store.commit('setSelectedProductCount', deleteIndex.value)
        } else {
          // 如果 deleteIndex 超出 cart 的長度，說明要刪除的是特價商品
          const discountedIndex = deleteIndex.value - cart.value.length
          const discountedProduct = discountedCart.value[discountedIndex]

          // 更新選中商品數量，減去刪除的特價商品數量
          const remainingProductCount =
            store.state.selectedProductCount - discountedProduct.quantity

          removeDiscountedProduct(discountedIndex)
          store.commit('setSelectedProductCount', remainingProductCount)
        }

        showConfirmation.value = false
      }
    }

    // 取消刪除
    const cancelDelete = () => {
      showConfirmation.value = false
    }

    // 存儲特價商品
    const calculateCheckoutTotal = () => {
      const cartTotal = cartRefs.value.reduce((total, product) => {
        if (product.priceType === 'original') {
          return total + parseFloat(product.price) * product.quantity
        }
        return total
      }, 0)

      const discountedTotal = discountedCart.value.reduce((total, product) => {
        if (product.priceType === 'discounted') {
          return total + parseFloat(product.price) * product.quantity
        }
        return total
      }, 0)

      const total = cartTotal + discountedTotal
      checkoutTotal.value = total
      return total
    }

    // 增加商品數量
    const incrementQuantity = (product, index) => {
      if (product.priceType === 'original') {
        if (!isNaN(product.originalPrice)) {
          product.quantity++
          product.price = (product.originalPrice * product.quantity).toFixed(2)
        } else {
          console.error('Invalid originalPrice for product:', product)
        }
      } else if (product.priceType === 'discounted') {
        const discountedProduct = discountedCart.value[index]

        if (discountedProduct) {
          // 增加或減少特價商品的數量
          if (!isNaN(discountedProduct.originalPrice)) {
            discountedProduct.quantity++
            discountedProduct.discountedPrice = (
              discountedProduct.originalPrice * discountedProduct.quantity
            ).toFixed(2)
          } else {
            console.error('Invalid originalPrice for discounted product:', discountedProduct)
          }
        } else {
          console.error('Discounted product not found:', product)
        }
      } else {
        console.error('Invalid priceType for product:', product)
      }

      checkoutTotal.value = calculateCheckoutTotal()
      updateSelectedProductCount()
    }

    // 減少商品數量
    const decrementQuantity = (product, index) => {
      if (product.priceType === 'original') {
        // 增加或減少原價商品的數量
        if (product.quantity > 1) {
          if (!isNaN(product.originalPrice)) {
            product.quantity--
            product.price = (product.originalPrice * product.quantity).toFixed(2)
          } else {
            console.error('Invalid originalPrice for product:', product)
          }
        }
      } else if (product.priceType === 'discounted') {
        // 特價商品
        const discountedProduct = discountedCart.value[index]
        // 增加或減少特價商品的數量
        if (discountedProduct) {
          if (discountedProduct.quantity > 1) {
            if (!isNaN(discountedProduct.originalPrice)) {
              discountedProduct.quantity--
              discountedProduct.discountedPrice = (
                discountedProduct.originalPrice * discountedProduct.quantity
              ).toFixed(2)
            } else {
              console.error('Invalid originalPrice for discounted product:', discountedProduct)
            }
          }
        } else {
          console.error('Discounted product not found:', product)
        }
      } else {
        console.error('Invalid priceType for product:', product)
      }

      checkoutTotal.value = calculateCheckoutTotal()
      updateSelectedProductCount()
    }

    // 刪除商品
    const removeProduct = (index) => {
      if (index >= 0 && index < cart.value.length) {
        cart.value.splice(index, 1)
        checkoutTotal.value = calculateCheckoutTotal()
      } else {
        console.error('Invalid index:', index)
      }

      deleteIndex.value = -1
      checkoutTotal.value = calculateCheckoutTotal()
      updateSelectedProductCount()
    }

    // 刪除特價商品
    const removeDiscountedProduct = (index) => {
      if (index >= 0 && index < discountedCart.value.length) {
        // 從特價商品列表中刪除商品
        discountedCart.value.splice(index, 1)
        //更新總價
        checkoutTotal.value = calculateCheckoutTotal()
      } else {
        console.error('Invalid index:', index)
      }
      // 重置 deleteIndex 的值
      deleteIndex.value = -1
    }

    // 輪播圖隨機排序
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }

    // 隨機選擇5張圖片
    const selectRandomImages = () => {
      const combinedArray = [...photoArray, ...photoArray2]
      shuffleArray(combinedArray)
      randomImages.value = combinedArray.slice(0, 5)
    }

    //組件掛載時，調用 selectRandomImages
    onMounted(() => {
      selectRandomImages()
    })
    return {
      combinedArray,
      randomImages,
      currentIndex,
      discountedCart,
      checkoutTotal,
      cart: cartRefs,
      showConfirmation,
      deletedProductName,
      incrementQuantity,
      decrementQuantity,
      cartTotal,
      removeProduct,
      removeDiscountedProduct,
      confirmDelete,
      cancelDelete,
      showDeleteConfirmation,
      selectRandomImages,
      initializeCart
    }
  }
}
</script>

<template>
  <div>
    <!-- 检查是否有商品 -->
    <div v-if="cart.length > 0 || discountedCart.length > 0">
      <h1 class="block-text-center">購物車</h1>
    </div>
    <div v-if="cart.length > 0 || discountedCart.length > 0">
      <table class="cart-table">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>商品價格</th>
            <th>選購数量</th>
            <th>總金額</th>
            <th>取消訂單</th>
          </tr>
        </thead>
        <tbody>
          <!-- 循環原價商品 -->
          <tr v-for="(product, index) in cart" :key="'cart-' + index">
            <td class="product-name">{{ product.name }}</td>

            <td>
              ＄{{
                product.priceType === 'discounted' ? product.discountedPrice : product.originalPrice
              }}
            </td>
            <td class="input-with-clear no-border">
              <button class="Quantity-control" @click="incrementQuantity(product, index)">+</button>
              <span class="custom-input">{{ product.quantity }}</span>
              <button class="Quantity-control" @click="decrementQuantity(product, index)">-</button>
            </td>
            <td>
              ＄{{
                product.quantity *
                (product.priceType === 'discounted'
                  ? product.discountedPrice
                  : product.originalPrice)
              }}
            </td>
            <td>
              <button @click="showDeleteConfirmation(index)" class="delete-product">取消</button>
            </td>
          </tr>
          <!-- 單獨循環特價商品 -->
          <tr v-for="(discountedProduct, index) in discountedCart" :key="'discounted-' + index">
            <td class="Special-offer-name">
              {{ discountedProduct.name }} <span class="special-offer">特價商品</span>
            </td>
            <td>＄{{ discountedProduct.price }}</td>
            <td class="input-with-clear no-border">
              <button class="Quantity-control" @click="incrementQuantity(discountedProduct, index)">
                +
              </button>
              <span class="custom-input">{{ discountedProduct.quantity }}</span>
              <button class="Quantity-control" @click="decrementQuantity(discountedProduct, index)">
                -
              </button>
            </td>
            <td>＄{{ discountedProduct.quantity * discountedProduct.price }}</td>
            <td>
              <!-- 添加删除按钮 -->
              <button @click="showDeleteConfirmation(cart.length + index)" class="delete-product">
                取消
              </button>
            </td>
          </tr>
        </tbody>
        <transition name="fade">
          <div v-if="showConfirmation" class="confirmation-dialog">
            <div class="modal-container">
              <span class="skull">取消訂單</span>
              <div class="modal">
                <p>確定取消『{{ deletedProductName }}』嗎？</p>
                <div class="all-button">
                  <button @click="confirmDelete" class="confirm-button">确定</button>
                  <button @click="cancelDelete" class="confirm-button">取消</button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </table>
      <p class="total-price">結帳總價：{{ cartTotal }}元</p>
    </div>
    <!-- 如果没有商品 -->
    <div v-else class="no-product">
      <p style="margin-bottom: 5px">還未選購任何商品</p>
      <p>立即前往選購商品</p>
      <router-link to="/article/manage" class="no-product-link">
        <span class="no-product-go"></span>前往選購</router-link
      >
    </div>
    <div><span class="lower-border">猜您喜歡</span></div>
    <div class="carousel">
      <el-carousel :interval="3000" type="card">
        <el-carousel-item
          v-for="(item, index) in randomImages"
          :key="item.id"
          class="el-carousel-item"
          @mouseenter="currentIndex = index"
          @mouseleave="currentIndex = null"
        >
          <div class="content-layout" :class="{ active: index === currentIndex }">
            <span v-if="index === currentIndex" class="goProduct-name">
              {{ item.caption }}
              <router-link to="/article/manage">
                <button class="goProduct-page">前往挑選</button>
              </router-link>
            </span>
          </div>
          <img :src="item.url" :alt="item.caption" class="carousel-img" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans TC', sans-serif;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
}
.cart-table th,
.cart-table td {
  border: 1px solid #909fa6;
  padding: 8px;
  text-align: center;
}
.product-name {
  padding: 0 10px;
}

.special-offer {
  font-size: 12px;
  border: 1px solid #909fa6;
  border-radius: 5px;
  background: linear-gradient(to bottom, #f0f8ff, #909fa6);
  padding: 1px;
}

.input-with-clear .Quantity-control,
.input-with-clear .custom-input {
  display: inline-block;
  vertical-align: middle;
}

.custom-input {
  border: 2px solid #d1dfeb;
  font-size: 16px;
  text-align: center;
  border-left: none;
  border-right: none;
  line-height: 36px;
  padding: 0 20px;
  background-color: white;
}

.Quantity-control {
  width: 30px;
  height: 40px;
  border: 2px solid #d1dfeb;
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  cursor: pointer;
}

.Quantity-control:first-child {
  border-right: none;
  border-radius: 5px 0 0 5px;
}

.Quantity-control:last-child {
  border-left: none;
  border-radius: 0 5px 5px 0;
}

.delete-product {
  width: 56px;
  margin: 10px auto;
  cursor: pointer;
  border-radius: 5px;
  background: linear-gradient(to bottom, #f0f8ff, #909fa6);
  box-shadow: 3px 2px 5px rgba(144, 159, 156, 0.5);
}

.delete-product:hover {
  background: #909fa6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.confirmation-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.skull {
  position: relative;
  background-color: #000;
  background-color: #909fa6;
  width: 100%;
  color: #edeef0;
  padding: 7px 29px;
  position: absolute;
  top: -20px;
  border-radius: 5px 5px 0 0;
}

.skull::before {
  position: absolute;
  left: 5px;
  top: 10px;
  content: url('https://api.iconify.design/zondicons/exclamation-solid.svg?color=white');
}

.modal {
  background-color: white;
  padding: 60px;
  border-radius: 0 0 5px 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.all-button {
  margin-top: 20px;
  margin: 20px 0 -40px 0;
}

.confirm-button {
  cursor: pointer;
  border-radius: 5px;
  background: linear-gradient(to bottom, #f0f8ff, #909fa6);
  box-shadow: 3px 2px 5px rgba(144, 159, 156, 0.5);
  margin: 10px 5px 0 5px;
  padding: 0 10px;
}

.confirm-button:hover {
  background: #909fa6;
}

.total-price {
  border: 1px solid #909fa6;
  border-top: none;
  width: 100%;
  text-align: center;
  font-weight: 800;
  padding: 10px;
  background-color: #d1dfeb;
  margin-bottom: 80px;
}

.block-text-center {
  position: relative;
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 36px;
  margin: 30px auto;
}

.block-text-center::before,
.block-text-center::after {
  content: '';
  position: absolute;
  width: calc(35% - 35px);
  height: 3px;
  background: #ccc;
  top: 50%;
  transform: translateY(-70%);
}

.block-text-center::before {
  left: 0;
}

.block-text-center::after {
  right: 0;
}

.lower-border {
  position: relative;
  width: 100%;
  display: inline-block;
  font-size: 36px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 20px;
  margin-bottom: 40px;
  padding-left: 40px;
}

.lower-border::before {
  background: url('https://api.iconify.design/fluent/star-24-filled.svg') no-repeat center center /
    contain;
  position: absolute;
  top: 10px;
  left: 2px;
  content: '';
  width: 30px;
  height: 30px;
}

.carousel {
  margin: 0 160px 80px 160px;
}

.carousel-img {
  display: flex;
  width: 500px;
  height: 300px;
  line-height: 200px;
  text-align: center;
}

.el-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  margin: 0 50px; /* 调整 margin 样式 */
  background-color: #d3dce6;
  cursor: default;
}

.content-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: black;
  line-height: 300px;
  font-size: 24px;
  opacity: 0.5;
  text-align: center;
}

.content-layout.active {
  background: rgba(255, 255, 255, 0.7);
}

.goProduct-name {
  position: relative;
}

.goProduct-name::before {
  background: url('https://api.iconify.design/icon-park-solid/knife-fork.svg') no-repeat center
    center / contain;
  position: absolute;
  top: 7px;
  left: -20px;
  content: '';
  width: 20px;
  height: 20px;
}

.goProduct-page {
  position: absolute;
  top: 40px;
  left: 20px;
  width: 90px;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.goProduct-page:hover {
  background-color: #909fa6;
  opacity: 1;
}
.no-product {
  font-size: 24px;
  text-align: center;
  margin: 10% auto;
}

.no-product-link {
  display: inline-block;
  background: linear-gradient(to bottom, #f0f8ff, #909fa6);
  box-shadow: 3px 2px 5px rgba(0, 0, 0, 1);
  color: #000;
  border: none;
  padding: 5px 10px;
  margin: 10px;
  border-radius: 4px;
  text-decoration: none;
}
.no-product-go {
  background: url('https://api.iconify.design/mdi/language-go.svg') no-repeat center center /
    contain;
  width: 50px;
  height: 50px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 5px;
}
</style>
