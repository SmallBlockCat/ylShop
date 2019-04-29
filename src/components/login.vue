<template>
  <div class="login">
  	<wechatAuth></wechatAuth>
  	<div class="toast">
  		<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  	</div>
  	<div class="info">
  		<h1>欢迎登录</h1>
  		<div>
  			<!--<span class="iconfont icon-yonghuming"></span>-->
  			<img class="icon" src="./common/img/user.png" alt="icon" />
  			<input type="text" v-model="name" placeholder="请输入用户名" @blur="loseBlur"/>
  		</div>
  		<div>
  			<!--<span class="iconfont icon-mima"></span>-->
  			<img class="icon" src="./common/img/passward.png" alt="icon" />
  			<input type="password" v-model="password" placeholder="请输入密码" @blur="loseBlur"/>
  		</div>
  	</div>
  	<p class="login_btn" @click="toLogin">登录</p>
  	<div class="loading_bg" v-if="isLoading">
  			<img src="./common/img/load.gif" alt="img" />
  	</div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import Vue from 'vue'
import {randomString} from '@/common/commonJs'
import wechatAuth from '@/components/common/tpl/wechatAuth'
export default {
  name: 'HelloWorld',
  data () {
    return {
    	toast:"",
    	isShowToast:false,
    	name:"",
    	password:"",
    	openid:"",
    	appid:"",
    	userId:"",
    	isLoading:false,
    	t:"",
    }
  },
  methods:{
  	loseBlur(){
  		var odiv=document.createElement('div')
	    odiv.style.height="999px"
	    document.body.appendChild(odiv)
	    setTimeout(()=>{
	        odiv.parentNode.removeChild(odiv)
	    },0)
  	},
  	toLogin(){
  		var _this = this;
  		if(this.name){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "请输入用户名"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		if(this.password){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "请输入密码"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		this.isLoading = true
  		var data = {
		    "loginName": this.name,
		    "password": randomString(this.password),
		    "openid": this.openid
		}
  		this.$http.post(this.$domain + "/user/login",data).then(function(response){
      	if(response.data.result.return_code == "SUCCESS"){
      		console.log(response.data.data.userType)
      		_this.isShowToast = false
	  			_this.toast = "登录成功!"
	  			_this.$cookie.set("name",_this.name,30)
	  			_this.$cookie.set("userType",response.data.data.userType,30)
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  				_this.isLoading = false
	  				_this.$router.push({path:"orderList",query:{'t':this.t}})
	  			},1000)
      	}else{
      		_this.$cookie.set('YLUSERID',"",30)
      		_this.$cookie.set('name',"",30)
      		_this.isLoading = false
      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			_this.name = ""
	  			_this.password = ""
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
      	}
  		})
  	}
  },
  mounted(){
  	//数据问题清缓存
  	this.appid = this.$cookie.get("appid");
  	this.openid = this.$cookie.get(this.appid + "_openid");
  	this.name = this.$cookie.get("name");
  	this.userId = this.$cookie.get("YLUSERID");
  	this.t = (new Date()).valueOf()
  	if(this.name && this.userId && this.openid){
  		this.$router.push({path:"orderList",query:{'t':this.t}})
  	}
  },
  components:{
		wechatAuth,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	body
		position relative
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
	.info
		h1
			text-align center
			line-height rem(88px)
			color #333
			margin-top rem(140px)
			margin-bottom rem(100px)
		div
			width rem(600px)
			height rem(88px)
			margin 0 auto
			display flex
			align-items center
			padding-left:rem(22px)
			padding-right rem(22px)
			margin-bottom rem(50px)
			.icon
				margin-right rem(22px)
				width rem(46px)
				height rem(46px)
			input
				flex 1
				border none
				background #eee
				border-radius rem(8px)
				line-height rem(60px)
				padding-left rem(20px)
				padding-top rem(10px)
				padding-bottom rem(10px)
				font-size rem(26px)
	.login_btn
		width rem(630px)
		line-height rem(88px)
		border-radius rem(8px)
		text-align center
		color #fff
		font-size rem(40px)
		margin 0 auto
		margin-top rem(160px)
		background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
	.loading_bg
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background rgba(255,255,255,.5)
		text-align center
		padding-top rem(400px)
		img
			width rem(66px)
			height rem(66px)
</style>
