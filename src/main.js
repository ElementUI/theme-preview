import Vue from 'vue';
import App from './app';
import router from './router';
import Element from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import './styles/index.css';
Vue.use(Element);

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App)
});
