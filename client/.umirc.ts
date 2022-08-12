import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  routes: [
    {
      path: '/login',
      component: 'login/index',
      wrappers: ['@/wrappers/notifications'],
    },
    {
      path: '/',
      component: '@/layouts/nav',
      wrappers: ['@/wrappers/auth', '@/wrappers/notifications'],
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
