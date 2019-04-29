import Vue from 'vue'
import Vuex from 'vuex'
// vuex/modules/index.js
import * as types from './mutation-types'
import getters from './getters'
import axios from 'axios'
import actions from './actions'
import mutations from './mutations'
import api from '../api/index'

Vue.use(Vuex)
const store =  new Vuex.Store({
	state:{
	},
	actions,
	//store.js
	mutations,
	getters
})
//热重载
if(module.hot){
	module.hot.accept([
		'./getters',
		'./actions',
		'./mutations'
	],() => {
		store.hotUpdate({
			getters: require('./getters'),
		    actions: require('./actions'),
		    mutations: require('./mutations')
		})
	})
}

export default store
