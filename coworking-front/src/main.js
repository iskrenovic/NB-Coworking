import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import axios from 'axios'
import store from '@/api-service'
import VueCookies from 'vue-cookies'

axios.defaults.baseURL = process.env.API_ENDPOINT;

Vue.config.productionTip = false
Vue.use(VueCookies);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
