//審查送出表單是否符合格式
import VueI18n from 'vue-i18n';
import zhTW from 'vee-validate/dist/locale/zh_TW';
import VeeValidate from 'vee-validate';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zhTW'
});

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    zhTW
  }
});
Vue.use(VeeValidate);

//vue axios
import axios from 'axios';
import VueAxios from 'vue-axios'; 

Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true

//bootstrap
import 'bootstrap'

//讀取資料loading套件
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.component('Loading', Loading)

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//vue filters
import currencyFilter from './js/filters/currency' //金錢轉為統一格式

Vue.filter('currency', currencyFilter);

//vue eventbus
import './js/bus'

import './js/timePlugin'

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from , next) => {
  if(to.meta.requiresAuth == true) {
    const api = `${PATH}/api/user/check`;
    axios.post(api).then((res) => {
        if(res.data.success) {
          next()
        }
        else {
          next({
            path: '/login'
          })
        }
    })
  }
  else {
    next()
  }
})
