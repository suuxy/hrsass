'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

let cdn = { css: [], js: [] }
// 通过环境变量 来区分是否使用cdn
const isProd = process.env.NODE_ENV === 'production' // 判断是否是生产环境
let externals = {}
if (isProd) {
  // 如果是生产环境 就排除打包 否则不排除
  // 要排除的包名
  // key(是要排除的包名): value(实际上是实际引入的包的全局的变量名 )
  // 因为要排除element-ui 所以后面要引入CDN文件 CDN文件中有ELEMENTUI的全局变量名
  // externals首先会排除掉 定义的包名,空出来的位置  会用变量来替换
  externals = {
    // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
    'vue': 'Vue', // 后面的名字不能随便起 应该是 js中的全局对象名
    'element-ui': 'ELEMENT', // 都是js中全局定义的
    'xlsx': 'XLSX' // 都是js中全局定义的
  }
  cdn = {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css' // 提前引入elementUI样式
    ], // 放置css文件目录
    js: [
      // 'https://unpkg.com/vue/dist/vue.js', // vuejs
      'https://cdn.jsdelivr.net/npm/vue@2.6.14',
      // 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
      'https://unpkg.com/element-ui/lib/index.js', // element
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js', // xlsx 相关
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js' // xlsx 相关
    ] // 放置js文件目录
  }
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // 当我们的本地的请求 有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
      // localhost:8888/api => http://ihrm.itheima.net/api
      '/api': {
        target: 'http://ihrm.itheima.net/', // 跨域请求的地址
        // target: 'http://ihrm-java.itheima.net/',
        changeOrigin: true // 只有这个值为true的情况下 才表示开启跨域
      }
    }
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: externals
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    //  注入cdn变量
    // 这行代码 会在执行打包的时候 执行 就会将cdn变量注入到 html模板中
    config.plugin('html').tap((args) => {
      // args 是注入html模板的一个变量
      args[0].cdn = cdn // 后面的cdn就是定义的变量
      return args // 需要返回这个参数
    })

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
