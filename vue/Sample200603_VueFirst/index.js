//在main.js引入qs
import  qs from 'qs'

//配全局属性配置，在任意组件内可以使用this.$qs获取qs对象

Vue.prototype.$qs = qs