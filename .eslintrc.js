// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 强制驼峰式命名
    'camelcase': 0,
    //对象字面量项尾不能有逗号
    "comma-dangle": [0, "never"],
    //空行最多不能超过2行
    "no-multiple-empty-lines": [0, {"max": 3}],
    //语句强制分号结尾
    "semi": [0, "always"],
    //必须使用全等
    "eqeqeq": 0,
    //逗号前后的空格
    "comma-spacing": 2,
    //缩进风格
    "indent": [1, 2],
    "space-after-keywords": [0, "always"],//关键字后面是否要空一格
    "space-before-blocks": [0, "always"],//不以新行开始的块{前面要不要有空格
    "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
    "space-in-parens": [0, "never"],//小括号里面要不要有空格
    "space-infix-ops": 0,//中缀操作符周围要不要有空格
    "space-return-throw-case": 0,//return throw case后面要不要加空格
    "space-unary-ops": [0, { "words": true, "nonwords": false }],//一元运算符的前/后要不要加空格
    "spaced-comment": 0,//注释风格要不要有空格什么的
    "no-irregular-whitespace": 0,//不能有不规则的空格
    "no-mixed-spaces-and-tabs": [0, false],//禁止混用tab和空格
    "no-multi-spaces": 0,//不能用多余的空格
    //文件以单一的换行符结束
    "eol-last": 0,
    //块语句内行首行尾是否要空行
    "padded-blocks": 0,
    //引号类型 `` "" ''
    "quotes": [0, "single"],
    //不能有声明后未被使用的变量或参数
    "no-unused-vars": [0, {"vars": "all", "args": "after-used"}],
    //对象字面量中冒号的前后空格
    "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
    "keyword-spacing": [0, {"overrides": {
      "if": {"after": false},
      "for": {"after": false},
      "while": {"after": false},
      "singleLine": {
        "beforeColon": false,
        "afterColon": true
      },
      "multiLine": {
        "beforeColon": true,
        "afterColon": true,
        "align": "colon"
      }
    }}],
    "no-undef": 0,//不能有未定义的变量
    "no-extend-native": 0,//禁止扩展native对象
    "no-extra-boolean-cast": 0,//禁止不必要的bool转换
    "handle-callback-err": 0,//nodejs 处理错误
    // 解构
    "prefer-destructuring": [0, {
      "array": true,
      "object": true
    }, {
      "enforceForRenamedProperties": false
    }],
    "no-tabs": 0,
    "no-useless-rename": 0,
    "no-useless-return": 0,
    "no-return-await": 0,
    //一行结束后面不要有空格
    "no-trailing-spaces": 0,
    //禁止无用的表达式
    "no-unused-expressions": 0,
    // 强制将对象的属性放在不同的行上
    "object-property-newline":0,
    "no-callback-literal": 0,
    //禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    "no-unneeded-ternary": 0,
    // 禁止在模板中使用不同的符号
    "no-template-curly-in-string": 0,
    // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    "template-curly-spacing": 0,
    //禁止在使用new构造一个实例后不赋值
    "no-new": 0,
    // 禁止 <template> 使用 key 属性
    'vue/no-template-key': 0,
    "vue/require-v-for-key": 0,
    "vue/no-unused-vars": 0,
    "vue/valid-v-for": 0,
    "vue/valid-v-on": 0,
    "vue/no-parsing-error": 0,
    "standard/no-callback-literal": 0,
    "vue/no-side-effects-in-computed-properties": 0,
    "no-mixed-operators": 0,
    "no-eval": 0,
    "prefer-promise-reject-errors": 0
  }
}
