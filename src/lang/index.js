import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入element的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入element的中文包
import customEN from './en' // 引入自定义英文包
import customZH from './zh' // 引入自定义中文包
Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookies.get('language') || 'zh', // 多语言类型
  messages: {
    zh: {
      ...elementZH,
      ...customZH
    },
    en: {
      ...elementEN,
      ...customEN
    }

  }

})
