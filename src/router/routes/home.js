const _import = require('./_import_' + process.env.NODE_ENV);

export default [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页'
    },
    // component: r => require.ensure([], () => r(require('@/view/home/index/home.vue')), 'home'),
    // component: _import('home/index/home', 'home'),
    component: () => import('@/view/home/index/home.vue')
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: '403'
    },
    // component: r => require.ensure([], () => r(require('@/view/home/403/index.vue')), '403'),
    // component: _import('home/403/index', '403'),
    component: () => import('@/view/home/403')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404'
    },
    // component: r => require.ensure([], () => r(require('@/view/home/404/index.vue')), '403'),
    // component: _import('home/404/index', '404'),
    component: () => import('@/view/home/404')
  }
]
