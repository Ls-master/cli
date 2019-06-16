---
title: 动态字段文档
---

### 1.描述一个字段的数据
```javascript
// 布局
layout: [{
	name,	//表单 title
	key,	// 布局 key
	type,	// 布局类型: 'FORM_FIELDS'单列表单, 'COLLAPSE'折叠面板, 'PARALLEL_FIELDS'瀑布流
	children: [	// 布局展示模块
		{
			field,	// fieldMetas的 key
			type: 'FIELD'	// 类型
		}
	]
}]

// 字段描述
fieldMetas: [{
	key,//字段的key
	name,//字段名称
	innerName,//内部标识
	type,//类型
	description,// 帮助文本
	scene: {
		field_event_listen:[], // 详情场景组件间通信用
		field_event_emit:[], // 详情场景组件间通信用
		scene_event_listen: [], // 详情场景组件和场景通信用
		scene_event_emit: [], // 详情场景组件和场景通信用
		element_props:{}, // 详情场景 element 组件扩展属性
		related_data, // 关联数据
		related_data_remote, // 详情场景关联数据远端地址
        related_data_remote_params, // 详情场景关联数据远端地址路径参数
				related_data_remote_query, // 详情场景关联数据远端地址查询参数
				related_data_remote_back_filter,	//关联数据远端地址查询返回后的数据格式化
        limit, // 详情场景用
		prefix, // 列表场景行前缀
		suffix, // 列表场景行后缀
		menu, // 列表场景行菜单
		route, // 列表场景行路由
		format, // 通用格式化
		validate: [], // 通用校验
		statics: {}, //常量
		decimal_limit: 1 // NUMBER 小数位数
	},
	env: {
		// READONLY: true,
		PURE: false,
		TITLE_RIGHT: {
			icon: 'icon-add',
			label: '添加筛选条件',
			handle: `
							const {component} = ctx; 
							let func = function(v) {
								console.log(v);
								component.setValue(v);
							};
							return {
								func: func,
								key: 'title'
							};
							`,
			prepare: null
		}
	}
}]

// 值
value: { key: value }
```

### 2.已有字段类型type（**名称前有星号的表示内部使用的字段，用户不可以在字段中添加**）



| 类型 | Type | 数据库 |描述|
| :-: | :- | :- |  :- |
| 文本 | TEXT  | {"text":"xxx"} ||
| URL | URL  |{"text":"xxx"}  ||
| 邮箱 | EMAIL |{"text":"xxx"}| |
| 电话 | PHONE  | {"text":"xxx"}| |
| 多行文本框 | TEXT_AREA | {"text":"xxx"}| |
| 数字 | NUMBER | {"decimals":0,"number":1.0}| |
| 金额 | CURRENCY | {"decimals":0,"number":1.0}| |
| 百分比 | PERCENT | {"decimals":0,"number":1.0}| |
| 计算公式 | CAL_FORMULA|{"decimals":0,"number":1.0}|  |
| 汇总归集 | COLLECTION |没存储，每次取数据时处理| 不支持引用/汇总 |
| *搜索条件 | SEARCH_CONDITION  |[{"field":{"label":"金额12","value":"key287"},"value":"10","relation":{"label":"等于","id":"EQUAL","value":"EQUAL"}},{"field":{"label":"数字  11","value":"key286"},"value":"1","relation":{"label":"不等于","id":"NOT_EQUAL","value":"NOT_EQUAL"}}]| 用于构建汇总字段表单中搜索条件字段 |
| 日期 | DATE| {"date":1523437206331}|类型:year("yyyy", "年（如：2017"), month("yyyy-MM", "月份（如：2017-12）"),date("yyyy-MM-dd", "日期（如：2017-12-15）"), datetime("yyyy-MM-dd HH:mm", "时间（如：2017-12-25 15:30）"); |
| 文件 | FILE  |{"files": [{"fileName": "line_horizontal.png","id": "5adab2a7590801097ad91402"}]}||
| 单选 | SELECT  |  {"selected": {"label": "name","value": "id" }}||
| 多选 | SELECT_MULTIPLE |{"selected": [{"label": "name","value": "595177f83a5a44138e611ce2"}]} |  |
| *键值对树 | KV_TREE | 键值对树，用于构建单选多选表单中选项字段 |
| 远程多选 | SELECT_MULTIPLE_REMOTE |{"selected": [{"label": "name","value": "595177f83a5a44138e611ce2"}]} | 通过远程接口拉取选项 |
| 远程单选 | SELECT_REMOTE  |{"selected": {"label": "name","value": "id" }}| 通过远程接口拉取选项 |
| 级联单选 | CASCADE|{"selected": [{"label": "name","value": "595177f83a5a44138e611ce2"}]} | 有层级关系单选 |
| 可搜索单选 | SELECT_SEARCH |{"selected": {"label": "未上线","value": "未上线" }} | 通过远程搜索拉取选项 |
| 复选框 | SINGLE_CHECKBOX  |{"value": true} | |
| 穿梭框 | TRANSFER  | [{"fixed": true,"label": "名称","value": "key446"},{"fixed": true,"label": "创建时间","value": "key449"}]| http://element.eleme.io/#/zh-CN/component/transfer |
| 引用字段 | REF_FIELD |数据库不存储 | 不支持引用/汇总 |
| 多选查找 | RELATION_MULTIPLE |{"selected": [{"label": "name","value": "595177f83a5a44138e611ce2"}]}|  |
| *多选查找关联字段| RELATION_MULTIPLE_SUMMARY |{"selected": [{"label": "name","value": "595177f83a5a44138e611ce2"}]}| 多选查找生成的关联字段 |
| 单选查找 | RELATION_SINGLE  |{"selected": {"label": "name","value": "id" }}|  |
| *单选查找关联字段 | RELATION_SINGLE_SUMMARY|{"selected": [{"label": "name","value": "595177f83a5a44138e611ce2"}]}| 单选查找生成的关联字段 |
