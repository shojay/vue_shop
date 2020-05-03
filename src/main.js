import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'

Vue.config.productionTip = false

Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
