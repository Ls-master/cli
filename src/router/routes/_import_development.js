// module.exports = (file, name = '') => require('@/view/' + file + '.vue').default
module.exports = (file, name = '') => import('@/view/' + file + '.vue')