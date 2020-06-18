import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Vant from 'vant';
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
import store from './store'


Vue.use(VueAxios, axios)

Vue.use(Lazyload);

Vue.use(Lazyload, {
  lazyComponent: true,
});


//设置基础请求路径
axios.defaults.baseURL = 'https://api.kele8.cn/agent';


Vue.use(Vant);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')