<template>
  <div class="pay_success">
  	<div class="toast">
  		<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  	</div>
  	<p class='pay_head'>交易成功</p>
  	<div class='head'>
  		<span class="iconfont icon-roundcheckfill"></span>
  		<p>支付成功</p>
  	</div>
  	<div class="content" v-if="data.orderOfficeXref && data.orderOfficeXref.sendType == 3 ">
  		<p class='text' v-if="verifyCode">请按医生要求去指定地点取货</p>
  		<p class='text_1' v-if="verifyCode"><span>取货凭证码:</span> &nbsp;<span class='text_2'>{{verifyCode}}</span></p>
  		<!--<p class='text' v-if="data.exp && data.exp.province">取货地址 : <span class="province">{{data.exp.province}}</span></p>-->
  	</div>
  	<div class="content" v-if="data.orderOfficeXref && data.orderOfficeXref.sendType == 1">
  		我们会尽快为您安排发货！
  	</div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import Vue from 'vue'
import wechatAuth from '@/components/common/tpl/wechatAuth'
export default {
  name: 'HelloWorld',
  data () {
    return {
    	verifyCode:"",
    	toast:"",
    	isShowToast:false,
    	data:""
    }
  },
  methods:{
  	getCode(){
  		var _this = this
  		this.$http.get(this.$domain + "/order/details?orderNo=" + this.$route.query.orderNo).then(function(response){
			if(response.data.result.return_code == "SUCCESS"){
				_this.data = response.data.data
				if(response.data.data.verifyCode){
					_this.verifyCode = response.data.data.verifyCode
				}
			}else{
				_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
			}
		})
  	}
  },
  mounted(){
  	
  	if(this.$route.query.orderNo){
  		this.getCode()
  	}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	p
		margin 0
	.toast
		position fixed
		width 100%
		margin 0 auto
		margin-top rem(240px)
		color #fff
		font-size rem(24px)
		display flex
		justify-content center
		.toast_text
			border-radius rem(8px)
			min-width rem(120px)
			max-width rem(600px)
			padding rem(10px) rem(30px)
			background rgba(0,0,0,.7)
			text-align center
	.pay_success
		text-align center
		height 100vh
		.pay_head
			line-height rem(88px)
			text-align center
			font-size: rem(36px);
			color: #282828;
			border-bottom rem(1px) solid #e1e1e1
			background #fff
		.head
			color #333
			display flex
			align-items center
			justify-content center
			height rem(300px);
			font-size: rem(46px);
			color #b71c20
			background #fff
			.icon-roundcheckfill
				margin-right rem(24px)
				font-size rem(56px)
		.content
			font-size rem(30px)
			color #333
			padding-left rem(60px)
			padding-right rem(60px);
			background #fff
			padding-top rem(30px);
			padding-bottom rem(30px)
			.text_1
				margin-top rem(30px)
				display flex
				justify-content center
				align-items center
				.text_2
					font-size rem(40px)
					color #b71c20
			.province
				color #999
</style>
