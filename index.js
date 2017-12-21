import Vue from 'vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueResource from 'vue-resource'
import App from './views/App.vue'
Vue.use(iView)
Vue.use(VueResource);
new Vue({
    el: 'app',
    render: h => h(App)
});