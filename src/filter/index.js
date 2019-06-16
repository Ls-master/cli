import Vue from 'vue';

Vue.filter('krSubstr', (value, num) => {
  if (!value) return '';
  let v = value.substr(0, num);
  if (value.length > num) {
    v = `${v}...`;
  }
  return v;
});

Vue.filter('krEllipsis', (value, length = 8) => {
  if (!value) return ''
  if (value.length > length) {
    return value.slice(0, length) + '...';
  }
  return value;
});
