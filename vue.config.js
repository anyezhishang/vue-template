const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// page title
const name = 'Vue Template'

module.exports = {
  publicPath: "/template/",
  outputDir: process.env.outputDir, //build输出目录
  assetsDir: 'assets', //静态资源目录（js, css, img）
  productionSourceMap: false,
  lintOnSave: true, //是否开启eslint
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    devtool: 'source-map'
  },
  devServer: {
    host: "localhost",
    port: '8080',
    open: true,
    https: false, //是否使用https协议
    hotOnly: true, //是否开启热更新
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/test': {
        target: process.env.VUE_APP_BASEURL, //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/test': ''
        }
      },
      '/product': {
        target: process.env.VUE_APP_BASEURL, //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/product': ''
        }
      }
    }
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/sass/variable.scss"`
      },
      scss: {
        prependData: `@import "~@/assets/sass/variable.scss";`
      },
    }
  }
}
