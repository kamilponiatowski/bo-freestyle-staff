import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('../views/SkillsView.vue')
    },
    {
      path: '/badges',
      name: 'badges',
      component: () => import('../views/BadgesView.vue')
    },
    {
      path: '/skill-catalog',
      name: 'skill-catalog',
      component: () => import('../views/SkillCatalogView.vue')
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue')
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('../views/ProgressView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutAcademyView.vue')
    }
  ]
})

export default router