import Vue from 'vue'

function rand(m, n) {
  return Math.floor(Math.random() * (n - m + 1) + m)
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.remove = function(e) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === e) {
      this.splice(i, 1)
      i--
    }
  }
  return this
}

Array.prototype.unique = function(forKey) {
  const arr = this
  const json = {}

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (json[item]) {
      arr.splice(i, 1)
      i--
    }
    json[item] = 1
  }

  return arr
}

Array.prototype.uniqueO = function(forKey) {
  const arr = this
  let json = {}

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const key = item[forKey]

    if (json[key]) {
      arr.splice(i, 1)
      i--
    }

    json[key] = 1
  }

  return arr
}

Number.prototype.fill = function(fillBy = '0', len = 2, isBack) {
  let str = this.toString()
  while (str.length < len) {
    str = (isBack ? str + fillBy : fillBy + str)
  }
  return str
}

Date.prototype.format = function(format) {
  const o = {
    y: this.getFullYear(),
    m: (this.getMonth() + 1).fill(),
    d: this.getDate().fill(),
    h: this.getHours().fill(),
    i: this.getMinutes().fill(),
    s: this.getSeconds().fill(),
  }
  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (key) => {
    return o[key]
  })
}

$.postJSON = function(url, data, succ, fail) {
  $.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/json; charset=utf-8',
    headers: {
      token: localStorage.token,
    },
    data: JSON.stringify(data),
    success: function(data) {
      succ && succ(data)
    },
    error: function(e) {
      fail && fail(e)
    }
  })
}


Vue.filter('date', (time) => {
  const date = new Date(time)
  if (date.toString() === 'Invalid Date') {
    console.warn('不支持的日期：' + time)
    return ''
  }
  return new Date(time).format('y-m-d h:i:s')
})

export default {}