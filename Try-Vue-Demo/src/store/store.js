import { createStore } from 'vuex'
import router from '@/router/index.js'
import { auth, checkIfUserIsRegistered  } from '../firebase/config.js'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth'
import { ElMessage } from 'element-plus'


export default createStore({
  state: {
    // 用戶信息
    user: null,
    // 用戶是否已認證
    isAuthenticated: false,
    // 產品價格
    selectedProducts: [],
    selectedProduct: null,
    // 存儲所選商品的價格
    selectedProductPrice: 0, 
    //存儲所選商品的價格類型(原價或折扣價)
    selectedProductPriceType: '', 
    // 購物車的數量
    quantity: 0,
    // 商品的總價格
    totalPrice: 0,
    // 購物車的總價格
    productPrice: 0,
    // 購物車小圖標數量
    selectedProductCount: 0,
    cart: [],
    //特價商品
    discountedCart: [],
    checkoutTotal: 0,
    removedProductIndices: new Set()
    
  },
  mutations: {
    // 設置用戶信息
    SET_USER(state, user) {
      state.user = user
    },
    // 清除用戶信息
    CLEAR_USER(state) {
      state.user = null
    },
    // 設置用戶是否已認證
    SET_AUTHENTICATED(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
    // 設置產品價格
    setQuantity(state, newQuantity) {
      // 更新狀態中的數量
      state.quantity = newQuantity;
    },
   // 設置產品價格
    setTotalPrice(state, totalPrice) {
      // 更新狀態中的總價格
      state.totalPrice = totalPrice;
    },
    setSelectedProduct(state, product) {
      state.selectedProduct = product
    },
   // store.js
  // 添加所選商品
  addSelectedProduct(state, product) {
    state.selectedProducts.push(product);
    state.selectedProductCount += product.quantity;
    if (product.priceType === 'discounted') {
      state.discountedCart.push(product);
    }
  }
  ,
  // 移除所選商品
  removeSelectedProduct(state, product) {
    const index = state.selectedProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      state.selectedProductCount -= product.quantity;
      state.selectedProducts.splice(index, 1);
    }
  },
  // 新增商品到購物車
  addToCart(state, product) {
 
    const existingProduct = state.cart.find((p) => p.name === product.name);
    
    if (existingProduct) {
      // 商品已存在於購物車中，增加數量
      existingProduct.quantity += product.quantity;
    } else {
      // 商品不存在於購物車中，添加到購物車中
      state.cart.push(product);
      state.discountedCart.push(product);
    }
    // 更新已選購商品的數量
    state.selectedProductCount = state.cart.reduce((total, p) => total + p.quantity, 0);
  },
  updateCheckoutTotal(state) {
    // 計算並更新結賬總價
    state.checkoutTotal = state.cart.reduce((total, product) => {
      return total + product.totalPrice;
    }, 0)
  },

   // 移除購物車中的商品
   removeFromCart(state, product) {
    const existingProduct = state.cart.find((p) => p.name === product.name);
  
    if (existingProduct) {
      // 商品存在於購物車中，減少數量
      existingProduct.quantity -= product.quantity;
  
      if (existingProduct.quantity <= 0) {
        // 如果商品数量小於等於0，則從購物車中移除
        const index = state.cart.indexOf(existingProduct);
        state.cart.splice(index, 1);
      }
    }
    // 更新已選購商品的數量
    state.selectedProductCount = state.cart.reduce((total, p) => total + p.quantity, 0);
    
  },
  // 購物車圖標數量
  setSelectedProductCount(state, count) {
    state.selectedProductCount = count;
  },
 
    clearCart(state) {
      // 清空購物車
      state.cart = [] 
      // 清空已選購商品的數量
      state.totalPrice = 0 
    },
    removeProductFromCart(state, index) {
      if (index >= 0 && index < state.cart.length) {
        state.cart.splice(index, 1); 
      } else if (index >= state.cart.length && index < state.cart.length + state.discountedCart.length) {
        const discountedIndex = index - state.cart.length;
        state.discountedCart.splice(discountedIndex, 1); 
      }
    },
    
    addDiscountedProductToCart(state, product) {
      state.cart.push(product);
      // 添加到discounted數組中
      state.discountedCart.push(product);
    },
    updateSelectedProductCount(state, newCount) {
      state.cart = newCount
    },
    setCart(state, cartData) {
      if (cartData && cartData.cart && cartData.discountedCart) {
        state.cart = cartData.cart;
        state.discountedCart = cartData.discountedCart;
      }
    },
  
},
  actions: {
    // 登入
   // actions in store.js
async login({ commit }, details) {
  const { email, password } = details;
  try {
    // 調用 signInWithEmailAndPassword 方法來登錄用戶
    await signInWithEmailAndPassword(auth, email, password);
    // 獲取當前用戶
    const user = auth.currentUser;

    if (user) {
      // 用戶信息不為空，說明登錄成功
      commit('SET_USER', user);
      commit('SET_AUTHENTICATED', true);
      localStorage.setItem('user', JSON.stringify(user));
      ElMessage.success('登入成功');
      router.push('/article/manage');
    } else {
      // 用戶信息為空，說明登入失敗
      ElMessage.error('登入失敗，請檢查您的信箱和密碼');
      router.push('/login');
    }
  } catch (error) {
    ElMessage.error('登入失敗，請檢查您的信箱和密碼');
    router.push('/login');
  }
}
,

    // 註冊
    async register({ commit }, details) {
      const { email, password } = details
      
      try {
        // 調用 checkIfUserIsRegistered 方法來檢查用戶是否已被註冊
        const isUserRegistered = await checkIfUserIsRegistered(email);

        if (isUserRegistered) {
          ElMessage.error('信箱已被註冊');
        } else {
          // 如果用戶未被註冊，則調用 createUserWithEmailAndPassword 方法來註冊用戶
          await createUserWithEmailAndPassword(auth, email, password);
          commit('SET_USER', auth.currentUser);
          router.push('/login');
          ElMessage.success('註冊成功');
        }
      } catch (error) {
        // 處理錯誤情況
        switch (error.code) {
          case 'auth/invalid-email':
            ElMessage.error('信箱格式錯誤');
            break;
          case 'auth/operation-not-allowed':
            ElMessage.error('開啟信箱/密碼登入功能');
            break;
          case 'auth/weak-password':
            ElMessage.error('密碼強度不足');
            break;
          default:
            ElMessage.error('出錯了');
        }
      }
    },

    async logout({ commit }) {
      await signOut(auth)
      commit('CLEAR_USER')
      commit('SET_AUTHENTICATED', false) // 用戶註銷
      localStorage.removeItem('user') // 移除本地存儲的用戶信息
      commit('clearCart'); // 清空購物車
      commit('setSelectedProductCount', 0); // 清空已選購商品的數量
            router.push('/article/manage')
      ElMessage.success('登出成功')
    },
    // 獲取用戶信息
    async fetchUser({ commit }) {
      // 從本地存儲中獲取用戶信息
      const userFromLocalStorage = JSON.parse(localStorage.getItem('user'))
      // 如果用戶信息存在，則調用 commit 方法來調用 mutations 中的 SET_USER 方法來設置用戶信息
      if (userFromLocalStorage) {
        // 調用 commit 方法來調用 mutations 中的 SET_USER 方法來設置用戶信息
        commit('SET_USER', userFromLocalStorage)
        // 調用 commit 方法來調用 mutations 中的 SET_AUTHENTICATED 方法來設置用戶是否已認證
        commit('SET_AUTHENTICATED', true) 
      }
    },
    selectProduct({ commit, state }, product) {
      // 如果已經選擇了該商品，則從已選商品列表中移除
      const existingProduct = state.selectedProducts.find(p => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        // 否則，添加到已選商品列表中
        commit('addSelectedProduct', product);
      }
      // 更新已選購商品的數量
      commit('setSelectedProductCount', state.selectedProducts.reduce((total, p) => total + p.quantity, 0));
    },
  },
    addToCart({ state,commit }, product) {
      if (product.priceType === 'discounted') {
        // 設置折扣價
        product.discountedPrice = product.price;
        commit('addDiscountedProductToCart', product);
      } else {
        commit('addToCart', product);
      }
      // 更新結帳總價，因為添加了新商品
      commit('updateCheckoutTotal'); 
      return Promise.resolve(); 
    }
  })
