import { createRouter, createWebHistory } from 'vue-router'
import ShoppingCart from '@/views/article/ShowShoppingCart.vue'

const routes = [
  // 首頁
  {
    path: '/',
    component: () => import('@/views/layout/LayoutContainer.vue'),
    redirect: '/article/manage',
    children: [
      {
        path: '/article/manage',
        name: 'articleManage',
        component: () => import('@/views/article/ProductOptions.vue'),
        children: [
          {
            path: 'popup',
            name: 'productPopup',
            component: () => import('@/views/article/ProductPopup.vue'),
            
          }
        ]
      },
      { path: '/article/showcart', name: 'showcart' , component: () => import('@/views/article/ShowShoppingCart.vue') },
      { path: '/article/channel', component: () => import('@/views/article/FamilyActivities.vue') },
      { path: '/user/profile', component: () => import('@/views/user/ProductIssues.vue') },
      { path: '/user/avatar', component: () => import('@/views/user/Abouts.vue') },
    ],
  },
  // 登入頁面
  { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  // 添加身份驗證，判斷用戶是否已經登錄
  const isAuthenticated = true; 

  if (to.name === 'productPopup' && !isAuthenticated) {
    //如果用戶未登入，且要跳轉的頁面是需要驗證的頁面，則跳轉至登入頁面
    next({ name: 'login' });
  } else {
    // 否則跳轉至頁面
    next();
  }
});


export default router
