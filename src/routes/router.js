import { createRouter, createWebHistory } from 'vue-router';
import OrderPage from '../components/OrderPage.vue';
import ManagePage from '../components/ManagePage.vue';
import LoginPage from '../components/LoginPage.vue';
import Home from '../components/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/order',
    name: 'Order',
    component: OrderPage
  },
  {
    path: '/manage',
    name: 'Manage',
    component: ManagePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    redirect: '/order'  // Đưa người dùng về trang order mặc định
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;