export const imagerror = {
  inserted(dom, options) {
    // dom 指令所作用的dom元素
    // options 指令所传入的变量
    // value属性可获取到变量的值
    dom.src = dom.src || options.value
    dom.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  },
  componentUpdated(dom, options) {
    // 会在当前指令作用的组件 更新数据完毕之后 执行
    // inserted只会执行一次
    // 组件初始化之后 一旦更新就不会再进入inserted函数 只会进入componentUpdated
    dom.src = dom.src || options.value
  }

}
