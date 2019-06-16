import _ from 'lodash';

/* eslint-disable consistent-return */
export default {
  downloadFile(url, data = {}) {
    const form = document.createElement('form');
    form.style.display = 'none';
    document.body.appendChild(form);
    form.target = '_blank';
    form.action = url;
    form.method = 'post';
    form.enctype = 'application/x-www-form-urlencoded';
    form.innerHTML = '';
    _.forEach(data, (value, key) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    form.submit();
  },
};
