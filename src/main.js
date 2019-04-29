// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import router from './router/router'
import flex from './assets/js/flexible'
import './common/stylus/index.styl'
import VueCookie from 'vue-cookie'
import VueBetterScroll from 'vue2-better-scroll'
import {baseUrl,baseUrl2,appid} from './config/env'
import store from './store/store'
import VueLazyload from 'vue-lazyload' //图片懒加载
//import VConsole from 'vconsole/dist/vconsole.min.js'
//new VConsole()

Vue.prototype.$http = axios
Vue.prototype.$domain = baseUrl;
Vue.prototype.$baseUrl2 = baseUrl2;
Vue.prototype.$appid = appid;
Vue.use(VueAxios, axios);
Vue.use(VueCookie)

Vue.use(VueLazyload, {
	error:require('./components/common/img/load2.png'),
	loading: require('./components/common/img/load2.png'),
})
//语言匹配不到时默认为英语
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

new Vue({
	router, //路由
	store,
	render: h => h(App) // App:每个vue页面
}).$mount("#app") //将new 的 vue实例挂载到 id = 'app' 的父元素下
