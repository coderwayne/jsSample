import ElementUI from 'element-ui'
import Vue from 'vue'
// import App from './App.vue'
import IMTest from './IMTest.vue'

Vue.use(ElementUI)
Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  render: h => h(IMTest),
}).$mount('#app')
