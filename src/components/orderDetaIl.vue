<template>
	<div class="order_detial">
		<div class="toast">
  			<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  		</div>
  		<p class="head">订单详情</p>
  		<div class="order_type">
  			<p class="color_2" v-if="list.orderStatus == 0">待付款</p>
  			<p class="color_3" v-if="list.orderStatus == 1">已付款</p>
  			<p class="color_3" v-if="list.orderStatus == 7">已发货</p>
  			<p class="color_1" v-if="list.orderStatus == 8">已完成</p>
  		</div>
  		<div class="info" v-if="list.exp">
  			<p v-if="list.orderOfficeXref && list.orderOfficeXref.sendType == 1"><span class="text">取货方式  :</span> <span class="text_2">快递配送</span></p>
  			<p v-if="list.orderOfficeXref && list.orderOfficeXref.sendType == 3"><span class="text">取货方式  :</span> <span class="text_2">在线支付</span></p>
  			
  			<p class="info_1" v-if="list.exp.name">
  				<span v-if="list.orderOfficeXref && list.orderOfficeXref.sendType == 1" class="text">收货信息  :</span> 
  				<span v-else class="text">取货人信息  :</span> 
  				<span v-if="list.exp && list.exp.name">{{list.exp.name}}</span>&nbsp;&nbsp;<span v-if="list.exp" class="phone">{{list.exp.phone}}</span></p>
  			<p v-if="list.orderOfficeXref && list.orderOfficeXref.sendType == 1">
  				<span class="text">快递地址  :</span> {{list.exp.province}}{{list.exp.city}}{{list.exp.counties}}{{list.exp.address}}
  			</p>
  			<!--<div v-else>
  				<p v-if='list.exp && list.exp.province'><span class="text">店铺地址  :</span> {{list.exp.province}}</p>
  			</div>-->
  			<p class='verifyCode' v-if="list.verifyCode"><span class="text">凭 证 码 &nbsp;&nbsp:</span> {{list.verifyCode}}</p>
  		</div>
  		<div class="content" v-if="list.orderOfficeXref">
  			<!--<p class="content_top" v-if="list.orderOfficeXref">{{list.orderOfficeXref.officeName}}</p>-->
  			<div v-if="list.orderOfficeXref.orderDetailList && list.orderOfficeXref.orderDetailList.length > 0" v-for="(item,index) in list.orderOfficeXref.orderDetailList" :key='index'>
	  			<div class="content_center">
		  			<div class="img">
		  				<img v-if="contentHttp(item.mainImg)" v-lazy="item.mainImg" alt="img" />
		  				<img v-else v-lazy="$baseUrl2 + item.mainImg" alt="img" />
		  			</div>
		  			<div class="content_center_right">
		  				<p class="name" v-if="item.productName">{{item.productName}}</p>
		  				<p class="dec" v-if="item.specName">规格 : {{item.specName}}</p>
		  				<p class="price"><span class="price_1" v-if="item.price">¥{{item.price}}</span><span v-if="item.price">×{{item.amount}}</span></p>
		  			</div>
	  			</div>
	  			<div class="content_bottom">
	  				<p>商品总金额</p>
	  				<p v-if="item.totalPrice">¥{{item.totalPrice}}</p>
	  			</div>
  			</div>
  		</div>
  		<div class="order_price" v-if="list.orderOfficeXref">
  			<p>订单金额</p>
  			<p>¥{{list.orderOfficeXref.totalPrice}}</p>
  		</div>
  		<div class="order_info">
  			<p v-if="list.recommend">所属医生  : {{list.recommend}}</p>
  			<p v-if="list.orderNo">订单编号 : {{list.orderNo}}</p>
  			<p v-if="list.orderDate">下单时间 : {{list.orderDate}}</p>
  		</div>
  		<div class="return_btn"  v-if="list.orderOfficeXref && list.orderOfficeXref.sendType == 1 && orderStatus == 1" @click="sureSend">
  			确认发货
  		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import {isContentHttp} from '@/common/commonJs'
export default {
  data () {
    return {
    	toast:"",
    	isShowToast:false,
    	list:"",
    	orderStatus:"",
    	orderNo:""
    }
  },
  methods:{
  	contentHttp(str){
  		return isContentHttp(str)
  	},
  	getDetial(){
  		var _this = this
  		if(this.$route.query.orderNo){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "订单号不存在!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  				return;
  			},1500)
  		}
	  	this.$http.get(this.$domain + "/order/details?orderNo=" + this.$route.query.orderNo).then(function(response){
	      	if(response.data.result.return_code == "SUCCESS"){
	      		_this.list = response.data.data
	      		_this.orderStatus = response.data.data.orderStatus
	      		_this.orderNo = response.data.data.orderNo
	      	}else{
	      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  				return;
	  			},1500)
		    }
	  	})
  	},
	sureSend(){
		var _this = this
		if(_this.orderStatus == 1 && _this.orderNo){
		}else{
			_this.isShowToast = true
  			_this.toast = "确认发货失败!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  				return;
  			},1500)
		}
		this.$http.post(this.$domain + "/order/updateOrder?orderNo="+this.orderNo+"&orderStatus=7" ).then(function(response){
	      	if(response.data.result.return_code == "SUCCESS"){
	      		console.log(response.data.data)
	      		_this.isShowToast = true
	  			_this.toast = response.data.data
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  				return;
	  			},1500)
	  			_this.getDetial()
	      	}else{
	      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  				return;
	  			},1500)
		    }
	  	})
	}
  },
  mounted(){
  	this.getDetial()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
.color_1
	color #09c4ac;
.color_2
	color #f2952c;
.color_3
	color #b71c20;
p
	margin 0
	padding 0
.order_detial
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
.order_detial
	background #f2f2f2
	height 100vh
	overflow-y: scroll;
	touch-action: pan-y;
	-webkit-overflow-scrolling: touch;
	padding-top rem(88px);
	.head
		line-height rem(88px)
		text-align center
		font-size rem(30px)
		color #333
		background #fff
		position fixed
		top 0
		left 0
		right 0
		border-bottom rem(1px) solid #e1e1e1
	.order_type
		text-align center
		line-height rem(96px);
		background #fff
		font-size rem(36px);
		font-weight bold
	.info
		margin-bottom rem(24px)
		background #fff
		padding rem(20px) rem(30px)
		font-size: rem(28px);
		color: #999999;
		p
			line-height rem(46px)
			.text
				display inline-block
	.content
		background #fff
		.content_top
			line-height rem(88px)
			border-bottom rem(1px) solid #e1e1e1
			font-size: rem(30px);
			color: #333333;
			padding-left rem(30px);
			padding-right rem(30px)
		.content_center
			display flex
			padding-left rem(30px)
			padding-right rem(30px)
			padding-top rem(16px)
			padding-bottom rem(16px)
			.img
				width rem(140px)
				height rem(140px)
				border-radius rem(8px)
				overflow hidden
				margin-right rem(24px)
				display flex
				justify-content center
				align-items center
				overflow hidden
				img
					width 100%
					height auto
			.content_center_right
				flex 1
				.name
					font-size: rem(28px);
					color: #333;
					margin-top rem(16px)
				.dec
					font-size: rem(26px);
					color: #999999;
					margin-top rem(16px);
				.price
					font-size: rem(30px);
					display flex
					justify-content space-between
					align-items center
					margin-top rem(20px)
					.price_1
						color #b71c21
		.content_bottom
			line-height rem(64px)
			display flex
			justify-content space-between
			align-items center
			padding-left rem(30px)
			padding-right rem(30px)
			font-size: rem(26px);
			color: #999999;
	.order_price
		line-height rem(88px);
		border-top rem(1px) solid #e1e1e1
		padding-left rem(30px);
		padding-right rem(30px);
		font-size: rem(30px);
		color: #222222;
		display flex
		justify-content space-between
		align-items center
		background #fff
	.order_info
		margin-top rem(24px)
		background #fff
		padding rem(30px)
		margin-top rem(16px)
		font-size: rem(26px);
		color: #999999;
	.return_btn
		width rem(600px);
		line-height rem(88px);
		border rem(1px) solid #e1e1e1
		border-radius rem(8px);
		margin rem(80px) auto
		text-align center
		font-size rem(30px);
		color #999
		background #fff
</style>
