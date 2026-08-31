const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: false,
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/'
})
