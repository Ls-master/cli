
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes/routes.js';
import Login from '@/view/login';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: Login
    },
    ...routes,
  ],
});

router.beforeEach((to, from, next) => {
  if(to.meta.title) {
    window.document.title = to.meta.title;
  } else {
    window.document.title = '...';
  }

  next();
})

export default router;
