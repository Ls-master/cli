import Vue from 'vue'

Vue.filter('fileSize', (size) => {
  if (!size) {
    return ''
  }

  size < 1 && (size = 1)

  const arr = [
    {size: 1, name: 'B'},
    {size: 1024, name: 'KB'},
    {size: 1048576, name: 'MB'},
    {size: 1073741824, name: 'GB'},
    {size: 1099511627776, name: 'TB'},
  ]

  for (let i = 0; i < arr.length; i++) {
    if (size < arr[i].size) {
      return (size / Math.pow(1024, i - 1)).toFixed(1) + arr[i - 1].name
    }
  }
})