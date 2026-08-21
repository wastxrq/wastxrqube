import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    label?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/timer',
    },
    {
      path: '/timer',
      name: 'timer',
      component: () => import('../views/TimerView.vue'),
      meta: { label: 'Timer' },
    },
    {
      path: '/oll',
      name: 'oll',
      component: () => import('../views/OllTrainerView.vue'),
      meta: { label: 'OLL' },
    },
    {
      path: '/pll',
      name: 'pll',
      component: () => import('../views/PllTrainerView.vue'),
      meta: { label: 'PLL' },
    },
    {
      path: '/f2l',
      name: 'f2l',
      component: () => import('../views/F2lGuideView.vue'),
      meta: { label: 'F2L' },
    },
  ],
})

export default router
