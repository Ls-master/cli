const _import = require('./_import_' + process.env.NODE_ENV);

export default [{
    path: '/test',
    name: 'test',
    meta: {
      title: 'test'
    },
    // component: r => require.ensure([], () => r(require('@/view/home/index/home.vue')), 'home'),
    component: _import('test/test1', 'test'),
  }
]
