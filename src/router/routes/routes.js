// 路由跟组件
import routerView from '@/view/index.vue';

import home from './home.js';
import test from './test.js';

const _import = require('./_import_' + process.env.NODE_ENV);

export const routes = [
  {
    path: '',
    name: 'app',
    component: routerView,
    children: [
      ...home,
      ...test
    ]
  }
]

const getRoutesDict = () => {
  const result = {};
  kr.collection.dfs(null, routes, 'children', (parent, node) => {
    if (!node.meta) {
      node.meta = {};
    }
    const full = [];
    if (parent) {
      full.push(parent.meta.fullPath);
    }
    full.push(node.path);
    node.meta.fullPath = node.path;
    // node.meta.fullPath = full.join('/').replace(/\/{2}/, '/');
    node.meta.parent = parent;
    // node.name = node.meta.fullPath;
    result[node.meta.fullPath] = node;
  });
  return result;
};


export default routes;
export const routesDict = getRoutesDict(routes);
