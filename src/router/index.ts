import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/components/home/HomeView.vue';
import UserRegistration from '@/components/registration/UserRegistration.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  {
    path: '/register',
    name: 'UserRegistration',
    component: UserRegistration
  },

];

const router = createRouter({
  history: createWebHistory(), // Usando o histórico HTML5 para navegação
  routes
});

export default router;
