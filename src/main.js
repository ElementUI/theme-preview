import Vue from 'vue';
import App from './app';
import router from './router';
import VueI18n from 'vue-i18n';
import Element from 'element-ui';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import 'element-ui/lib/theme-default/index.css';
import './styles/index.css';
require('es6-promise').polyfill();

Vue.use(VueI18n);
Vue.use(Element);
Vue.config.lang = 'zh-cn';
Vue.locale('zh-cn', zhLocale);
Vue.locale('en', enLocale);

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App)
});
