<template>
  <div class="foot">
  	<div class="toast">
  		<span>dsvds</span>
  		<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  	</div>
  	<div class="foot-item" :class="{select:selectUrl == 'goodsList'}" @click="toPage('goodsList')">
  		<span class="iconfont icon-dianpu2"></span>
  		<p>首页</p>
  	</div>
  	<div class="foot-item goods" :class="{select:selectUrl == 'orderList'}" @click="toPage('orderList')">
  		<span class="iconfont icon-dingdan3"></span>
  		<p>订单</p>
  	</div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import Vue from 'vue'
export default {
  name: 'foot',
  data () {
    return {
    	selectUrl:"",
    	toast:"",
    	isShowToast:false,
    }
  },
  methods:{
  	toPage(url){
  		var _this = this
  		this.$router.push(url)
  	}
  },
  mounted(){
  	this.selectUrl = this.$route.name
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	.toast
		position fixed
		width 100%
		margin 0 auto
		margin-top rem(240px)
		color #fff
		font-size rem(24px)
		display flex
		justify-content center
		z-index 11
		.toast_text
			border-radius rem(8px)
			min-width rem(120px)
			max-width rem(600px)
			padding rem(10px) rem(30px)
			background rgba(0,0,0,.7)
			text-align center
	.foot
		position fixed
		right 0
		left 0
		bottom 0
		background #fff
		height rem(112px)
		z-index 10
		display flex
		justify-content space-around
		border-top rem(1px) solid #e1e1e1
		padding-top rem(10px)
		.foot-item
			text-align center
			color #999
			width 50%
			p
				margin-top rem(4px)
				font-size rem(24px)
			span
				font-size rem(36px)
		.select
			color #b71c20
</style>
