import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue'),  
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('../components/skills.vue'),  
  },
  {
    path: '/animation',
    name: 'Animation',
    component: () => import('../components/animation.vue'), 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

