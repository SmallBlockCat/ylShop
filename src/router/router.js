import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
	routes:[
//		列表页
		{
	    	path:'/goodsList',
	    	name:'goodsList',
	    	component: resolve => require(['.././components/goodsList.vue'], resolve)
		},
		{
	    	path:'/order',
	    	name:'order',
	    	component: resolve => require(['.././components/order.vue'], resolve)
		},
//		{
//	    	path:'/storeList',
//	    	name:'storeList',
//	    	component: resolve => require(['.././components/storeList.vue'], resolve)
//		},
		{
	    	path:'/login',
	    	name:'login',
	    	component: resolve => require(['.././components/login.vue'], resolve)
		},
		{
	    	path:'/orderList',
	    	name:'orderList',
	    	component: resolve => require(['.././components/orderList.vue'], resolve)
		},
		{
	    	path:'/orderDetaIl',
	    	name:'orderDetaIl',
	    	component: resolve => require(['.././components/orderDetaIl.vue'], resolve)
		},
		{
	    	path:'/paySuccess',
	    	name:'paySuccess',
	    	component: resolve => require(['.././components/paySuccess.vue'], resolve)
		},
		//添加地址
		{
	    	path:'/address',
	    	name:'address',
	    	component: resolve => require(['.././components/address.vue'], resolve)
		},
		//清除cookie重新授权
		{
	    	path:'/clearInfo',
	    	name:'clearInfo',
	    	component: resolve => require(['.././components/clearInfo.vue'], resolve)
		},
		//单商品扫码支付
		{
	    	path:'/payOrder',
	    	name:'payOrder',
	    	component: resolve => require(['.././components/payOrder.vue'], resolve)
		},
		{
	      path: '/',//主页面的路由
	      name: 'login',
	      component: resolve => require(['.././components/login.vue'], resolve)//懒加载
	    }
	]
})
export default router
