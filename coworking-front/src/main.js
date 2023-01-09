import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import axios from 'axios'

axios.defaults.baseURL = process.env.API_ENDPOINT;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
