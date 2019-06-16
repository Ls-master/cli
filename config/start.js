// 启动文件, 可用node直接启动, 无需使用npm
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const fs = require('fs')
const path = require('path')

const program = require('commander')
const spawn = require('child_process').spawn


program
.option('-c, --config, [config]')
.parse(process.argv)

const proxyRouter = {
  dev: 'https://investment-dev.jingdata.com',
  test: 'https://investment-test.jingdata.com',
}

function createLocalJson (url) {
  return {
    "localTarget": `${url}/api/`,
    "proxyTable": {
      "/api": {
        "target": `${url}/api/`,
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      },
      "/stage": {
        "target": `${url}/api/`,
        "changeOrigin": true,
        "pathRewrite": {
          "^/stage": ""
        }
      },
      "/flow": {
        "target": `${url}/api/`,
        "changeOrigin": true,
        "pathRewrite": {
          "^/flow": ""
        }
      },
      "/task": {
        "target": `${url}/api/`,
        "changeOrigin": true,
        "pathRewrite": {
          "^/task": ""
        }
      },
      "/layout": {
        "target": `${url}/api/`,
        "changeOrigin": true,
        "pathRewrite": {
          "^/layout": ""
        }
      }
    }
  }
}

const json = JSON.stringify(createLocalJson(proxyRouter[program.config]))
fs.writeFile(path.join(__dirname, './config.local.json'), json, (err, data) => {
  if (err) {
    throw new Error('写入路由配置文件, 异常', err)
  }
  spawn('npm', ['run','dev'], {
    stdio: 'inherit' // 从父进程传入或传入父进程相应的 stdio 流
  })
})





