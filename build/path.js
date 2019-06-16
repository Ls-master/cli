const path = require('path');

const project = path.resolve(__dirname, '../');
const dist = path.resolve(project, 'dist');
const src = path.resolve(project, 'src');
const build = path.resolve(project, 'build');

const components = path.resolve(src, 'components');
const directive = path.resolve(src, 'directive');
const filter = path.resolve(src, 'filter');
const locale = path.resolve(src, 'locale');
const mixin = path.resolve(src, 'mixin');
const router = path.resolve(src, 'router');
const service = path.resolve(src, 'service');
const store = path.resolve(src, 'store');
const style = path.resolve(src, 'style');
const utils = path.resolve(src, 'utils');
const view = path.resolve(src, 'view');



module.exports = {
  project,
  dist,
  src,
  build,
  components,
  directive,
  filter,
  locale,
  mixin,
  router,
  service,
  store,
  style,
  utils,
  view
};
