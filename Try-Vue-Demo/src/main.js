import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)

// 調用 fetchUser 方法來獲取用戶信息
store.dispatch('fetchUser').then(() => {
  app.mount('#app')
})
