  <script>
  import { elementPlusComponents, elementPlusIcons } from '@/store/elementPlusComponents.js'
  import ProductPopup from '@/views/article/ProductPopup.vue'
  import { computed, ref, watch ,reactive } from 'vue'
  import { useStore } from 'vuex'
  import { photoArray, photoArray2 } from './commodity'
  import { useRouter } from 'vue-router'

  export default {
    components: {
      ProductPopup,
    },
    setup() {   
      const router = useRouter()
      // 顯示當前選中的列和內容
      const activeColumn = ref('column1')
      const store = useStore()
      const quantity = ref(1)
      // 選中的商品
      const selectedProduct = ref(null)
      // 添加購物車開關
      const showPopup = ref(false)
      // 選中的商品數量
      const selectedQuantity = ref(0)
      // 存儲商品資訊
      const cartItems = ref([]) 
      // 總價
      const totalPrice = ref(0)
      // 價格類型
      const priceType = ref('原價') 
      // 顯示登入提示
      const showMessage = ref(false) 
   

      // 計算購物車選中的商品數量
      const storeSelectedProduct = computed(() => store.state.selectedProduct)
      
      // 看商品是否有折扣
      const hasDiscount = (product) => {
        return product.discountedPrice !== null && product.discountedPrice < product.originalPrice
      }


          // 監聽購物車變化
          watch(storeSelectedProduct, (newSelectedProduct) => {
        if (newSelectedProduct) {
        
          quantity.value = 1 
          selectedProduct.value = newSelectedProduct
          showPopup.value = true 
        } else {
          showPopup.value = false
        }
      })

      // 關閉彈出視窗
      const closePopup = () => {
        showPopup.value = false
        selectedProduct.value = null
      }

      // 顯示商品彈出視窗
      const showProductPopup = (product) => {
  if (!store.state.isAuthenticated) {
    showMessage.value = true;
  } else {
    quantity.value = 1;
    priceType.value = '原價';
    selectedProduct.value = product;
    showPopup.value = true;
  }
}

// 未登入前往登入頁面
const goToLogin = () => {
  showMessage.value = false;
  router.push('/login');
}

// 取消購買
const cancelPurchase = () => {
  showMessage.value = false;
}

    const clearSelection = () => {
      cartItems.value = []
      totalPrice.value = 0

      selectedProduct.value = null
      quantity.value = 1

      priceType.value = '原價'

      clearCart()
    }

    const cart = reactive(
  store.state.cart.map((product) => {
    const discountedPrice = hasDiscount(product) ? product.discountedPrice : null;

    return {
      ...product,
      originalPrice: parseFloat(product.originalPrice),
      price: parseFloat(product.price),
      discountedPrice: parseFloat(discountedPrice)
    };
  })
);

// 添加到購物車
const addToCart = (product) => {
  const priceInfo = {
    name: product.caption,
    price: hasDiscount(product) ? product.discountedPrice : product.originalPrice,
    priceType: hasDiscount(product) ? '優惠價格' : '原價',
    discountedPrice: hasDiscount(product) ? product.discountedPrice : null
  };
  cartItems.value.push(priceInfo);

  // 添加到購物車含折扣
  const cartItem = {
    name: product.caption,
    price: parseFloat(priceInfo.price),
    priceType: priceInfo.priceType,
    discountedPrice: priceInfo.discountedPrice
  
  };
  store.commit('addToCart', cartItem);

  totalPrice.value += priceInfo.price;

  showPopup.value = false;
};

    // 切換列
    const toggleColumn = (columnName) => {
      activeColumn.value = columnName
    }

    // 根據當前選中的列，返回對應的數組
    const activeButtonPhotos = computed(() => {
      return activeColumn.value === 'column1' ? photoArray : photoArray2
    })

    // 顯示當前選中的列和內容
    const buttons = [
      { name: 'column1', label: '冷藏商品' },
      { name: 'column2', label: '常溫商品' }
    ]
 
    return {
      activeColumn,
      store,
      quantity,
      selectedProduct,
      showPopup,
      selectedQuantity,
      cartItems,
      totalPrice,
      showMessage,
      storeSelectedProduct,
      toggleColumn,
      closePopup,
      clearSelection,
      hasDiscount,
      photoArray,
      photoArray2,
      buttons,
      activeButtonPhotos,
      showProductPopup, 
      addToCart,
      cart,
      priceType,
      goToLogin,
      cancelPurchase,
      ...elementPlusComponents,
      ...elementPlusIcons
    }
  }
}
</script>

<template>
  <div>
    <div
      class="custom-button-container"
      v-show="activeColumn === 'column1' || activeColumn === 'column2'"
    >
      <div class="button-content">
        <button
          v-for="(button, index) in buttons"
          :key="index"
          class="custom-border"
          :class="{ 'el-col-custom-active': activeColumn === button.name }"
          @click="toggleColumn(button.name)"
        >
          <div class="image-container">{{ button.label }}</div>
        </button>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="grid-images-container" :key="activeColumn">
        <div class="image-item-container">
          <div v-for="(photo, index) in activeButtonPhotos" :key="index" class="image-item-wrapper">
            <div class="image-item-content">
              <img
                :src="photo.url"
                alt="照片"
                class="image-item"
                :style="{ 'max-width': '300px', 'max-height': '200px' }"
              />
            </div>
            <div class="product-item-content">
              <p class="caption">{{ photo.caption }}</p>
              <p class="price">
                
                <div class="price-layout">
               <span
                  v-if="index % 2 === 1 && photo.discounted"
                  class="original-price red with-line"
                  :class="{ 'red with-line': hasDiscount(photo), black: !hasDiscount(photo) }"
                >
                  價格＄{{ photo.originalPrice }}

                </span>
                <span v-else class="original-price black"> 價格＄{{ photo.originalPrice }} </span>
                <span v-if="index % 2 === 1 && hasDiscount(photo)" class="discounted-price">
                  優惠價格＄{{ photo.discountedPrice }}
                </span>
            </div>
            <button @click="showProductPopup(photo)" class="open-popup-button">購買</button>
            <div v-if="showMessage" class="custom-modal">
  <div class="modal-content">
    <div class="modal">
      <span class="skull">尚未登入</span>
      <p class="firstLogin">前往登入頁面</p>
      <div class="all-button">
        <button @click="goToLogin" class="confirm-button">前往登入</button>
        <button @click="cancelPurchase" class="confirm-button">取消購買</button>
      </div>
    </div>
  </div>
</div>

              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <router-view></router-view>
    <ProductPopup
    :showPopup.sync="showPopup"
      :selectedProduct="selectedProduct"
      :priceType="priceType"
      :originalPrice="selectedProduct ? selectedProduct.originalPrice : 0"
      :discountedPrice="selectedProduct ? selectedProduct.discountedPrice : 0"
      v-model:quantity="selectedQuantity"
      @closePopup="showPopup = false"
      @clearSelection="clearSelection"
    />
  </div>
  
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: inline-block;
}

div {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  margin-bottom: 20px;
  flex-grow: 1; 
}

.image-container {
  display: flex;
  justify-content: center;
  align-content: center;
  word-wrap: break-word;
}

.button-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-button-container {
  text-align: center;
  margin: 20px 25%;
}

.custom-border {
  display: inline-block;
  width: 100px;
  height: 50px;
  line-height: 50px;
  border: 1px solid black;
  margin: 10px;
  text-align: center;
  border-radius: 10px;
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  font-family: 'Kanit', sans-serif;

}

.grid-images-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap; 
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 20px;
  overflow-wrap: break-word;
  flex-grow: 1;
}
.image-item {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%; 
}

.image-item-wrapper {
  flex: 0 0 calc(33.33% - 20px);
  height: auto; 
  width: calc(33.33% - 20px); 
  box-sizing: border-box;
  text-align: center;
  margin-right: 20px; 
  margin-bottom: 50px; 

}

.product-item-content {
  max-width: 300px;
    margin: 0 auto;
    width: 100%;
    height: auto;
    border: 2px solid #909fa6;
    border-top: none;
    background-color: #909fa6;
    font-family: 'Kanit', sans-serif;
}

.image-item-content {
  display: flex;
  height: 200px;
  flex-direction: column;
  text-align: center;
  overflow-wrap: break-word;
  align-items: center;
  justify-content: flex-start; 
  margin-bottom: 0;
}

.caption {
  width: 100%;
  height: 0;
  margin: 2px auto; 
  text-decoration: underline;
  font-weight: bold;
  padding: 10px 0 0 0;
  vertical-align: center;
}

.caption::before {
  content: url('https://api.iconify.design/solar/star-bold-duotone.svg?');
  margin-right: 5px;
  vertical-align: middle; 
}

.price {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0 0 0;
}

.price-layout {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px; 
  padding: 0 40px; 
}

.price > * {
  margin: 5px 0; 
}

.original-price.red,
.original-price.black,
.discounted-price {
  margin: 0; 
}

.original-price.red,
.discounted-price {
  display: flex;
  align-items: center; 
}

/* 紅色原價 */
.original-price.red {
  text-decoration: line-through;
  margin-right: 10px; 
}

/* 黑色原價 */
.original-price.black {
  color: black;
  margin-left: 31%;
}

.original-price.with-line {
  text-decoration: line-through; 
}

.discounted-price {
  color: #c4c4c4;
  margin-left: 10px;
  font-weight: 700;
  text-shadow: 3px 2px 5px rgba(196, 196, 196, 0.6);
}

.open-popup-button {
  display: block;
  width: 56px;
  margin: 10px auto; 
  cursor: pointer;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 2px 5px rgba(0, 0, 0, 1);
}

.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.modal {
  width: 300px;
  display: flex;
    flex-direction: column;
  background-color: white;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 80%;
}

.skull {
  width: 300px;
  display: flex;
  position: relative;
  background-color: #000;
  background-color: #909fa6;
  color: #edeef0;
  padding: 7px 29px;
  bottom: 60px;
  border-radius: 10px 10px 0 0;
}

.skull::before {
  position: absolute;
  left: 5px;
  top: 8px;
  content: url('https://api.iconify.design/guidance/pen.svg');
}


.firstLogin {
  font-size: 20px;
  font-weight: 700;
}

.all-button {
  display: flex;
    justify-content: center;
  margin: 20px 0 -40px 0;
}

.confirm-button {
  width: 80px;
  height: 30px;
  cursor: pointer;
  border-radius: 50px;
  background: linear-gradient(to bottom, #f0f8ff, #909fa6);
  box-shadow: 3px 2px 5px rgba(144, 159, 156, 0.5);
  margin: 10px 5px 0 5px;
  padding: 0 10px;
}


.el-col-custom-active {
  color: #778899;
  text-shadow: 3px 2px 5px rgba(196, 196, 196, 0.6);
  text-decoration: underline;
  font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.sureLogin {
  width: 20px;
  background-color: #778899;
}
</style>
