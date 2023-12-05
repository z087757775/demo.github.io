<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    showPopup: Boolean,
    selectedProduct: Object,
    originalPrice: Number,
    discountedPrice: Number,
    cart: Array,
    addToCart: Function
  },
  setup(props, { emit }) {
    const store = useStore()
    const quantity = ref(1)
    // 特價商品
    const discountedCart = ref([])
    const selectedProduct = ref(props.selectedProduct)

    // quantity的值重置為1
    const resetValues = () => {
      quantity.value = 1
    }

    // 確保數量大於 0
    const validateQuantity = () => {
      if (quantity.value < 1) {
        resetValues()
      }
    }

    // input接受數量輸入
    const onQuantityInput = (newValue) => {
      quantity.value = newValue
      validateQuantity()
    }

    // 計算特價商品或原價商品的總價
    const getTotalPrice = (product) => {
      const currentQuantity = quantity.value
      let price = 0

      if (
        product.discounted &&
        !isNaN(product.discountedPrice) &&
        product.discountedPrice >= 0 &&
        !isNaN(currentQuantity) &&
        currentQuantity >= 0
      ) {
        price = product.discountedPrice * currentQuantity
      } else if (
        !isNaN(product.originalPrice) &&
        product.originalPrice >= 0 &&
        !isNaN(currentQuantity) &&
        currentQuantity >= 0
      ) {
        price = product.originalPrice * currentQuantity
      } else {
        console.error('Invalid price or quantity for product:', product)
      }

      return price
    }

    // 計算總價
    const totalProductPrice = computed(() => {
      if (props.selectedProduct) {
        return getTotalPrice(props.selectedProduct)
      }
      return 0
    })

    // 加入購物車
    const addToCart = () => {
      if (props.selectedProduct) {
        if (isNaN(props.selectedProduct.originalPrice) || props.selectedProduct.originalPrice < 0) {
          console.error('Invalid originalPrice for selectedProduct:', props.selectedProduct)
          return
        }

        props.selectedProduct.originalPrice = parseFloat(props.selectedProduct.originalPrice)

        const productToAdd = {
          id: props.selectedProduct.id,
          name: props.selectedProduct.caption,
          price: props.selectedProduct.discounted
            ? props.selectedProduct.discountedPrice
            : props.selectedProduct.originalPrice,
          quantity: quantity.value,
          originalPrice: props.selectedProduct.originalPrice,
          priceType: props.selectedProduct.discounted ? 'discounted' : 'original'
        }

        store.commit('addToCart', productToAdd)

        emit('updateQuantity', quantity.value)
        emit('updateCart', store.state.cart)
        emit('updateSelectedProductCount', store.state.selectedProductCount)

        resetValues()

        if (props.selectedProduct.discounted) {
          const discountedProductToAdd = {
            id: props.selectedProduct.id,
            name: props.selectedProduct.caption,
            price: props.selectedProduct.discountedPrice,
            quantity: quantity.value,
            originalPrice: props.selectedProduct.originalPrice,
            priceType: 'discounted'
          }

          discountedCart.value.push(discountedProductToAdd)
        }

        closePopup()
      }
    }

    // 關閉購物車
    const closePopup = () => {
      resetValues()
      emit('closePopup')
    }

    //清空購物車
    const clearSelection = () => {
      store.commit('clearCart')

      resetValues()
    }

    // 計算數量是否小於 1
    const isDecrementDisabled = computed(() => quantity.value === 1)

    // 減少數量
    const decrementQuantity = () => {
      if (!isDecrementDisabled.value) {
        quantity.value--
        validateQuantity()
      }
    }

    // 增加數量
    const incrementQuantity = () => {
      quantity.value++
      validateQuantity()
    }

    return {
      discountedCart,
      quantity,
      totalProductPrice,
      validateQuantity,
      onQuantityInput,
      addToCart,
      closePopup,
      clearSelection,
      resetValues,
      decrementQuantity,
      incrementQuantity,
      isDecrementDisabled
    }
  }
}
</script>
<template>
  <div>
    <transition name="fade" mode="in-out">
      <!-- 購物欄 -->
      <div class="product-popup" v-if="showPopup">
        <div class="popup-content">
          <div class="popup-header">
            <h1 class="Product-shopping-cart">商品購物車</h1>
            <h2 class="Product-name">{{ selectedProduct.caption }}</h2>
          </div>
          <div class="popup-body">
            <img :src="selectedProduct.url" alt="照片" />
            <p v-if="selectedProduct.discounted">商品優惠：{{ selectedProduct.discountedPrice }}</p>
            <p v-else>商品價格：{{ selectedProduct.originalPrice }}</p>
            <div class="input-with-clear">
              商品數量：
              <div class="input-with-clear">
                <button
                  @click="decrementQuantity"
                  class="Quantity-control"
                  style="cursor: pointer"
                  :disabled="isDecrementDisabled"
                >
                  -
                </button>
                <input
                  type="number"
                  :value="quantity"
                  min="1"
                  class="custom-input"
                  placeholder="選購數量"
                  @input="onQuantityInput($event.target.value)"
                />
                <button @click="incrementQuantity" class="Quantity-control" style="cursor: pointer">
                  +
                </button>
              </div>
            </div>

            <div class="total-price-section">
              <p class="total-price">選購總價：{{ totalProductPrice }}</p>
              <button @click="clearSelection" class="Clear-cart">清除購物車</button>
            </div>
            <div class="button-container">
              <button @click="addToCart" class="add-car">加入購物車</button>
              <button @click="closePopup" class="close-car">關閉購物車</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

button {
  cursor: pointer;
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  color: #3c3c3c;
  font-size: 12px;
  border-radius: 35px;
  padding: 5px 5px;
}
.Product-shopping-cart {
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  color: black;
  margin: 0;
  padding: 10px 0;
  position: relative;
  top: -20px;
  left: -20px;
  width: calc(100% + 40px);
  box-sizing: border-box;
  text-align: center;
  border-radius: 5px 5px 0 0;
  font-size: 32px;
  color: #a0522d;
}

.Product-shopping-cart::before {
  content: url('https://api.iconify.design/ep/shopping-trolley.svg');
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  transform: scale(1.5);
  position: relative;
  top: -7px;
  filter: invert(12%) sepia(79%) saturate(3164%) hue-rotate(0deg) brightness(98%) contrast(107%);
}

.Product-name {
  font-size: 24px;
  margin-bottom: 10px;
  text-decoration: underline;
  font-size: 24px;
}

.Product-name::before {
  content: url('https://api.iconify.design/mingcute/star-fill.svg');
  margin-right: 5px;
}
.product-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  font-family: 'Kanit', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.popup-content {
  background: linear-gradient(to bottom, #f5f5f5, #edeef0);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
}

p {
  font-size: 18px;
  margin: 20px 0;
}

.popup-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #909fa6;
}
.input-with-clear {
  display: flex;
  align-items: flex-end;
  margin-right: -38px;
  margin-top: 4px;
  font-size: 18px;

  text-align: center;
}

.input-with-clear .custom-input {
  width: 50px;
  height: 30px;
  border: 2px solid #909fa6;
  font-size: 16px;
  flex: 1;
  text-align: center;

  border-left: none;
  border-right: none;
}

.Quantity-control {
  width: 30px;
  height: 30px;
  border: 2px solid #909fa6;
  background-color: #fff;
}

.Quantity-control:first-child {
  border-right: none;
  border-radius: 5px 0 0 5px;
}

.Quantity-control:last-child {
  border-left: none;
  border-radius: 0 5px 5px 0;
}

.total-price-section {
  display: flex;
  align-items: center;
  margin: 12px 0 0 14%;
}

.total-price {
  margin-right: 10px;
}

.Clear-cart {
  margin-left: 5px;
  background: linear-gradient(to bottom, #d1dfeb, #edeef0);
  color: #3c3c3c;
  border: none;
  padding: 5px 5px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 35px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0 15px 60px;
}

.add-car {
  margin-right: 30px;
  padding: 12px 30px;
  vertical-align: middle;
}

.add-car::before {
  content: url('https://api.iconify.design/akar-icons/circle-plus-fill.svg');
  vertical-align: middle;
  margin-right: 3px;
}

.close-car {
  padding: 12px 30px;
  vertical-align: middle;
}

.close-car::before {
  content: url('https://api.iconify.design/akar-icons/circle-x-fill.svg');
  vertical-align: middle;
  margin-right: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
