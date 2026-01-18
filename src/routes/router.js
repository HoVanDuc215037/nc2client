import { createRouter, createWebHistory } from 'vue-router';
import RestaurantPage from '../components/Restaurant/Restaurant.vue';
import ManageOrdersPage from '../components/Manage/ManageOrder/ManageOrder.vue';
import ManageProductionPage from '../components/Manage/ManageProduction/ManageProduction.vue';
import ManageStatisticPage from '../components/Manage/ManageStatistic/ManageStatistic.vue';
import LoginPage from '../components/Login/Login.vue';
import Home from '../components/Home/Home.vue';
import ManageMapPage from '../components/Manage/ManageMap/ManageMap.vue'
import ProfilePage from '../components/Manage/Profile/Profile.vue'
import ManageStaffPage from '../components/Manage/ManageStaff/ManageStaff.vue'
import MainManagePage from '../components/Manage/MainManage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/restaurant/:?/:?',
    name: 'Restaurant',
    component: RestaurantPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    redirect: '/login'  // Đưa người dùng về trang order mặc định
  },
  {
    path: '/manage',
    component: MainManagePage,
    children: [
      { path: 'orders', redirect: { name: 'ManageOrdersPage', component: ManageOrdersPage } },
      { path: 'production', redirect: { name: 'ManageProductionPage', component: ManageProductionPage } },
      { path: 'statistic', redirect: { name: 'ManageStatisticPage', component: ManageStatisticPage } },
      { path: 'map', redirect: { name: 'ManageMapPage', component: ManageMapPage } },
      { path: 'profile', redirect: { name: 'ProfilePage', component: ProfilePage } },
      { path: 'staff', redirect: { name: 'ManageStaffPage', component: ManageStaffPage } },
    ]
  },
  {
    path: '/login-success/:?',
    name: 'LoginSuccessPage',
    component: () => import('../components/Login/LoginSuccess.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;