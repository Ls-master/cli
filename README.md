
## 项目结构

```
.
├── build   
├── config                     
├── dist                                              // 编译后文件
├── doc                                               // 文档管理  
│                                     
├── src            
│   ├── service                                       // 接口配置                
│
│   ├── utils                                         // 工具方法
│       ├── code
│           ├── common.js                             // 请求错误状态码说明
│           ├── index.js                              // 出口
│       ├── config.js                                 // 项目共用配置文件
│
│
│   ├── components                                    // 通用组件
│
│   ├── view                                          // 视图组件
│       ├──  index.vue                                // 首页
│
│   ├── store                                         // vuex
│       
│   ├── router                                        // 路由
│        ├── index.js                                 // 路由输出文件
│        ├── routes                                   // 路由配置
│             ├── routes.js                           // 路由配置文件
│
│   ├── style                                         // 样式
│       ├── element-ui                                // elementUi样式重置
│       ├── theme                                     // 主题
│       ├── class.scss                                // 全局class
│       ├── function.scss                             // sass全局方法
│       ├── var.scss                                  // sass全局声明
│       ├── reset.scss                                // 重置浏览器默认样式
│       ├── mixin.scss                                // sass 全局mixin
│       ├── index.scss                                // 入口
│
│   ├── assets                                        // 资源
│   ├── directive                                     // 指令
│       ├── iconFont                                  // 图标
│       ├── img                                       // 图片
│
.

```

> Vue command

## Build Setup

``` bash
# 安装依赖
npm install

# 启动服务
npm run use-dev

# 打包
npm run build

# 建立生产和包分析报告
npm run build --report

# 运行单元测试
npm run unit

# 运行e2e测试
npm run e2e

# 运行所有测试
npm test
```


git 相关
sh ./git_branch.sh saas1.1 tsz
