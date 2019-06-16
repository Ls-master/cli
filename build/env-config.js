
module.exports = ({ REQUEST_LOC, OPEN_STATUS }) => {

  return `
      <script type=text/javascript>

        ;(function(WIN){
                
          'use strice';
          
          WIN.env = {
            REQUEST_LOC: '${ REQUEST_LOC }',        // 接口请求地址
            OPEN_STATUS: ${ OPEN_STATUS },          // 是否启用配置文件
          };
          
        })(window);

      </script>
    `;

}