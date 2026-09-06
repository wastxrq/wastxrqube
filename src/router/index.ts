import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    labelKey?: string
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
      meta: { labelKey: 'app.tabs.timer' },
    },
    {
      path: '/oll',
      name: 'oll',
      component: () => import('../views/OllTrainerView.vue'),
      meta: { labelKey: 'app.tabs.oll' },
    },
    {
      path: '/pll',
      name: 'pll',
      component: () => import('../views/PllTrainerView.vue'),
      meta: { labelKey: 'app.tabs.pll' },
    },
    {
      path: '/f2l',
      name: 'f2l',
      component: () => import('../views/F2lGuideView.vue'),
      meta: { labelKey: 'app.tabs.f2l' },
    },
  ],
})

export default router
