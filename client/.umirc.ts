import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  routes: [
    {
      path: '/login',
      component: 'login/index',
    },
    {
      path: '/',
      component: '@/layouts/nav',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          path: '/home',
          component: 'home/index',
        },
        {
          path: '/callback',
          component: 'callback/index',
        },
      ],
    },
  ],
});
