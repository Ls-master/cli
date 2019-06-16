const fs     = require('fs');
const path   = require('path');
const chalk  = require('chalk');
const config = require('./env-config.js');

const FILE_PATH   = path.resolve(__dirname, '../dist/index.html');
const REQUEST_LOC = process.argv[2];

if(!/(http|https):\/\/.+\..{0,30}\..+/ig.test(REQUEST_LOC)) {
  console.log(chalk.red(`
    接口地址异常，请检查： ${ REQUEST_LOC }
  `));
  return;
}

fs.readFile(FILE_PATH, 'utf-8', (err, data) => {

  if (err) throw err;

  const HTML_CONFIG = config({
    REQUEST_LOC: REQUEST_LOC,  // 线上接口请求地址
    OPEN_STATUS: true,         // 是否启用配置文件
  });
  const HTML_TEXT   = data.toString().replace(/(.+)(<head>)(.+)(<\/head>)(.+)/ig,`
    $1
    $2
    ${ HTML_CONFIG }
    $3
    $4
    $5
  `);
  
  fs.writeFile(FILE_PATH, HTML_TEXT , err => {
    if (err) throw err;
    console.log(chalk.cyan(`
------------------------------------------------------------------------------
                                  脚本插入成功  \n
                                ${ HTML_CONFIG }
------------------------------------------------------------------------------
    `));
  });

});