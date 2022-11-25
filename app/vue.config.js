const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      //配置代理服务器来解决跨域问题
      '/api/': {
        target: 'http://gmall-h5-api.atguigu.cn', //配置要替换的后台接口地址
        changeOrigin: true,
      },
    },
  },
});
