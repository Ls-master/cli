---
title: KrDetail
---

### Detail Attributes

```javascript
v-bind: {
  layout,   // 布局
  fieldMetas,   // 字段描述
  value,    // 表单初始值
  env: {
    PURE: false // 是否开启展示状态
  },
  fieldSubmitDataflow: {  // 实时编辑提交数据流
    api,  // 提交接口
    prepare,  // 组装请求参数
    effect,   // 接口返回值处理
  }
}

```

### Detail Events
```javaScript
change, // scene-change事件, scene_event_listen
```
