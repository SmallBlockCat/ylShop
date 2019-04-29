<template>
  <div class="order">
  	<wechatAuth></wechatAuth>
  	<div class="toast">
  		<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  	</div>
  	<p class="order_head">订单确认</p>
  	<div class="pose">
  		<p @click="selectType(3)">
  			<!--<span v-if="sendType == 3" class="iconfont icon-yuanquanxuanzhong"></span>
  			<span v-else class="iconfont icon-yuanquanweixuan"></span>-->
  			<img v-if="sendType == 3" class="select" src="./common/img/select.png" alt="img" />
  			<img v-else class="select" src="./common/img/noselect.png" alt="img" />
  			<span :class="{addr_text:sendType == 3}">在线支付  </span>
  		</p>
  		<p @click="selectType(1)">
  			<!--<span v-if="sendType == 1" class="iconfont icon-yuanquanxuanzhong"></span>
  			<span v-else class="iconfont icon-yuanquanweixuan"></span>-->
  			<img v-if="sendType == 1" class="select" src="./common/img/select.png" alt="img" />
  			<img v-else class="select" src="./common/img/noselect.png" alt="img" />
  			<span :class="{addr_text:sendType == 1}">快递配送</span>
  		</p>
  	</div>
  	<!--到店自提-->
  	<div class="pose_info" v-if="sendType == 3">
  		<div class="pose_info_btn_1" v-if="poseInfo" @click="addInfo">
  			<div>
  				<!--<p v-if="address">自提地址 :   &nbsp;&nbsp;&nbsp; &nbsp;{{address}}</p>-->
	  			<p>
	  				取货人信息 : &nbsp;<span class="name">{{name}}</span><span>{{phone}}</span>
	  			</p>
  			</div>
	  		<span class="iconfont icon-arrow-sl"></span>
  		</div>
  		<p class="pose_info_btn" v-else @click="addInfo">
  			<span>点击添加提货人信息</span>
  			<span class="iconfont icon-arrow-sl"></span>
  		</p>
  	</div>
  	<!--商家配送-->
  	<div class="store_express" v-if="sendType == 1">
  		<div @click="addAddress">
	  		<div v-if="addressInfo">
	  			<p class="text_info"><span class="name">{{addressInfo.name}}</span><span>{{addressInfo.phone}}</span></p>
	  			<p>{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.counties}}{{addressInfo.address}}</p>
	  		</div>
	  		<div class="address_btn" v-else>
	  			点击添加收货地址
	  		</div>
  		</div>
	  	<span class="iconfont icon-arrow-sl"></span>
  	</div>
  	<div class="pose_bg" v-if="isAddInfo ">
  		<div class="pose_bg_content">
  			<div class="pose_bg_content_head">请填写提货人信息</div>
  			<p>
  				<span>姓名:</span>
  				<input type="text" v-model="name" @blur="loseBlur"/>
  			</p>
  			<p>
  				<span>电话:</span>
  				<input type="number" v-model="phone" @blur="loseBlur"/>
  			</p>
  			<div class="btns">
  				<p class="btn1" @click="concal">取消</p>
  				<p class="btn2" @click="sure">确认</p>
  			</div>
  		</div>
  	</div>
  	<div class="list">
	  	<div class="order_list" v-if="orderList">
	  		<div class="img">
	  			<img v-if="contentHttp(orderList.mainImg)" v-lazy="orderList.mainImg" alt="imgs" />
	  			<img v-else v-lazy="$baseUrl2 + orderList.mainImg" alt="imgs" />
	  		</div>
	  		<div class="detail">
	  			<p class="detail_name">{{orderList.name}}</p>
	  			<p class="detail_dec">{{orderList.descriptions}}</p>
	  			<div class="detail_info">
	  				<p>
	  					<span class="text">单价</span>
	  					<span class="text_1" v-if="orderList.price">¥{{orderList.price}}</span>
	  				</p>
	  				<div> 
	  					<span class="text">数量</span>
	  					<p>
	  						<span class="iconfont icon-jian" @click="jian"></span>
	  						<span class="count">{{count}}</span>
	  						<span class="iconfont icon-jian1" @click="add"></span>
	  					</p>
	  				</div>
	  			</div>
	  		</div>
  		</div>
  	</div>
  	<div class="total_info">
  		<p>
  			<span class="text_2">总数量</span>
  			<span class='text_3 text_3_count'>×{{count}}</span>
  		</p>
  		<p>
  			<span class="text_2">商品总额</span>
  			<span class='text_3'>¥{{parseFloat(totailPrice).toFixed(2)}}</span>
  		</p>
  		<div>
  			<span class="text_2">合计</span>
  			<span class="text_3 text_3_price">¥{{parseFloat(totailPrice).toFixed(2)}}</span>
  		</div>
  	</div>
  	<div class="footer">
  		<div class="left">
  			<p>
  				<span class="text_2">数量:</span>
  				<span class="text_3">{{count}}</span>
  			</p>
  			<p>
  				<span class="text_2">合计:</span>
  				<span class="text_3 text_3_price">¥{{parseFloat(totailPrice).toFixed(2)}}</span>
  			</p>
  		</div>
  		<div class="right" @click="submit">立即支付</div>
  	</div>
  	<div class="pay_bg" v-if="isPaySuccess">
  		<div class="pay_content">
  			<p class="pay_text">支付成功!</p>
  			<p class="pay_btn" @click="toSuccess">确认</p>
  		</div>
  	</div>
  	<div class="loading_bg" v-if="isShowLoading">
  		<div class="loading_content">
  			<img src="./common/img/load.gif" alt="loading" />
  		</div>
  	</div>
  	<div class="load_bg" v-if="isLoad">
  		<img src="./common/img/load.gif" alt="loading" />
  	</div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import Vue from 'vue'
import wechatAuth from '@/components/common/tpl/wechatAuth'
import {address} from '@/common/js/address.js'
import {isContentHttp} from '@/common/commonJs'
export default {
  name: 'HelloWorld',
  data () {
    return {
    	orderList:"",
    	totailPrice:0,
    	orderProduct:[],
    	isAddInfo:false,
    	address:"",
    	name:"",
    	phone:"",
    	poseInfo:"",
    	orderNo:"",
    	toast:"",
    	isShowToast:false,
    	userId:"",
    	isPaySuccess:false,
    	isShowLoading:false,
    	sendType:3,//默认到店自提
    	addressInfo:"",
    	expressId:"",
			seller:"",
			count:1,
			recommend:"",
			isLoad:true
    }
  },
  methods:{
  	contentHttp(str){
  		return isContentHttp(str)
  	},
  	getOrder(){
  		var _this = this;
  		this.$http.get(this.$domain + "/goods/get/"+ this.$route.query.id +"?recommend=" + this.$route.query.recommend).then(function(response){
      	if(response.data.result.return_code == "SUCCESS"){
      		_this.isLoad = false
      		_this.orderList = response.data.data;
      		_this.address = _this.orderList.selfAddress
      		_this.seller = _this.orderList.officeId
      		if(_this.$cookie.get("address")){
			  		_this.poseInfo = _this.$cookie.get("address")
			  		_this.name = _this.poseInfo.split("|")[0]
			  		_this.phone = _this.poseInfo.split("|")[1]
			  	}
  				_this.totailPrice = _this.count * _this.orderList.price
      	}else{
      		_this.isLoad = false
      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
      	}
  		})
  	},
  	jian(){
  		if(this.count > 1){
  			this.count--
  			this.totailPrice = this.count * this.orderList.price
  		}
  	},
  	add(){
  		this.count++
  		this.totailPrice = this.count * this.orderList.price
  	},
  	//查询地址
  	getAddress(){
  		var _this = this
  		this.$http.get(this.$domain + "/order/getExpAddress/" + this.$cookie.get("YLUSERID")).then(function(response){
      	if(response.data.result.return_code == "SUCCESS"){
      		_this.addressInfo = response.data.data
      		_this.expressId = response.data.data.id
      	}else{
      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
      	}
  		})
  	},
  	//添加地址
  	addAddress(){
  		this.$router.push({path:"address",query:{"id":this.$route.query.id,"recommend":this.$route.query.recommend}})
  	},
  	//选择取货方式
  	selectType(type){
  		this.sendType = type
  		if(this.sendType == 3){
  			this.poseInfo = this.$cookie.get("address")
  		}else if(this.sendType == 1){
  			this.getAddress()
  		}
  	},
  	//添加自提信息
  	addInfo(){
  		this.isAddInfo = !this.isAddInfo
  	},
  	//确认修改信息
  	sure(){
  		this.isAddInfo = !this.isAddInfo
  		if(this.phone && this.name){
  			this.poseInfo = this.name + "|" + this.phone
  			this.$cookie.set("address",this.poseInfo,30)
  		}
  	},
  	//取消信息修改
  	concal(){
  		this.isAddInfo = !this.isAddInfo
  	},
  	//提交订单
  	submit(){
  		var _this = this;
  		if(this.totailPrice){
  		}else{
  			return;
  		}
  		if(this.sendType == 3){
  			this.expressId = ""
  			if(this.poseInfo){
	  		}else{
	  			this.isShowToast = true
	  			this.toast = "提货人信息不存在!"
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
	  			return;
	  		}
  		}else if(this.sendType == 1){
  			this.poseInfo = ""
  			if(this.expressId){
  			}else{
  				this.isShowToast = true
	  			this.toast = "请添加收货地址"
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
	  			return;
  			}
  		}
  		if(this.$cookie.get("YLUSERID")){
  		}else{
  			this.isShowToast = true
  			this.toast = "用户信息不存在!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		this.orderProduct = [{
        "productId":this.orderList.id,
        "amount": this.count
			}]
  		console.log(this.orderProduct)
  		if(this.orderProduct){
  		}else{
  			this.isShowToast = true
  			this.toast = "商品信息不完善!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		this.isShowLoading = true
  		var data = {
			    "orderTotalPrice": parseFloat(this.totailPrice).toFixed(2),
			    "orderExpressPrice": 0,
			    "disPrice":0,
			    "buyer":this.$cookie.get("YLUSERID"),
			    "seller":this.seller,
			    "orderType":1,
			    "sendType":this.sendType,
			    "address":this.poseInfo,
			    "expressId":this.expressId,
			    "orderProduct": this.orderProduct,
			    "recommend":this.recommend
			}
  		this.$http.post(this.$domain + "/order/directOrder/",data).then(function(response){
      	if(response.data.result.return_code == "SUCCESS"){
      		_this.orderNo = response.data.data.orderNo
      		if(_this.orderNo && _this.sendType !== 4){
      			_this.toPay()
      		}else{
      			_this.isShowLoading = false
      			_this.isPaySuccess = true
      		}
      	}else{
      		_this.isShowToast = true
      		_this.isShowLoading = false
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
      	}
  		})
  	},
  	//去支付
  	toPay(){
  		var _this = this;
  		this.$http.post(this.$domain + "/payment/pay?orderNo="+ this.orderNo).then(function(response){
      	if(response.data.result.return_code == "SUCCESS" ){
      		if(!response.data.data.success){
      			_this.isShowToast = true
		  			_this.toast = response.data.data.msg
		  			setTimeout(function(){
		  				_this.isShowToast = false
		  				_this.toast = ""
		  				return;
		  			},1500)
      		}
      		if(typeof WeixinJSBridge == "undefined"){
					   if( document.addEventListener ){
					       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					   }else if (document.attachEvent){
					       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
					       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					   }
					}else{
						_this.isShowLoading = false
						if(!response.data.data.success){
							_this.isShowToast = true
			  			_this.toast = response.data.data.msg
			  			setTimeout(function(){
			  				_this.isShowToast = false
			  				_this.toast = ""
			  			},1500)
			  			return
						}
						if(response.data.data.data.appId){
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest',
								{
									"appId" : response.data.data.data.appId,
									"timeStamp" : response.data.data.data.timeStamp,
									"nonceStr" : response.data.data.data.nonceStr,
									"package" : response.data.data.data.package,
									"signType" : response.data.data.data.signType,
									"paySign" : response.data.data.data.sign
								},
								function(result) {
									if (result.err_msg == "get_brand_wcpay_request:ok") {
										_this.isPaySuccess = true
										// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
									} else {
										_this.isPaySuccess = false
										_this.isShowToast = true
						  			_this.toast = "支付失败!"
						  			setTimeout(function(){
						  				_this.isShowToast = false
						  				_this.toast = ""
						  			},1500)
									}
							});
						}
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
  	},
  	toSuccess(){
  		var _this = this
  		setTimeout(function(){
  			_this.$router.push({path:"paySuccess",query:{"orderNo":_this.orderNo}})
  		},1000)
  	},
    //失去焦点时重新渲染dome
  	loseBlur(){
  		var odiv=document.createElement('div')
	    odiv.style.height="999px"
	    document.body.appendChild(odiv)
	    setTimeout(()=>{
	        odiv.parentNode.removeChild(odiv)
	    },0)
  	},
  },
  mounted(){
  	if(this.$route.query.recommend){
  		this.recommend = this.$route.query.recommend
  	}
  	if(this.$route.query.from == "address"){
  		this.sendType = 1
  	}
  	this.getOrder();
  },
  components:{
  	wechatAuth,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	.iconfont
		color #b71c20
	.icon-arrow-sl
		font-size rem(38px)
	body
		position relative
		overflow-y: scroll;
		touch-action: pan-y;
		-webkit-overflow-scrolling: touch;
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
	p
		padding 0
		margin 0
	.order
		background #f2f2f2
		height 100vh
		overflow scroll
		padding-bottom rem(156px)
		padding-top rem(88px)
		.order_head
			line-height:rem(88px)
			text-align center
			font-size: rem(32px);
			color: #000000;
			background #fff
			border-bottom rem(1px) solid #e1e1e1
			position fixed
			top 0
			left 0
			right 0
			background #fff
		.pose
			padding rem(20px) rem(30px);
			font-size: rem(28px);
			color: #777777;
			background #fff
			p
				line-height rem(76px);
				span
					margin-right rem(16px);
				.select
					margin-right rem(16px);
					width rem(36px) !important;
					height rem(36px) !important;
				.icon-yuanquanxuanzhong
					color #b71c21
			.addr_text
				font-size: rem(28px);
				color: #333333;
		.pose_info
			.pose_info_btn
				display flex
				align-items center
				justify-content space-between
				font-size rem(28px);
				color #333
				line-height rem(88px);
				border-top rem(1px) solid #e1e1e1
				border-bottom rem(1px) solid #e1e1e1
				padding-left rem(30px);
				padding-right rem(30px);
				background #fff
			.pose_info_btn_1
				display flex
				align-items center
				justify-content space-between
				font-size rem(28px);
				color #333
				border-top rem(1px) solid #e1e1e1
				background #fff
				padding rem(24px) rem(30px)
				.icon-arrow-sl
					margin-left rem(20px)
				.name
					color #333
					font-size rem(30px);
					margin-right rem(20px);
		.store_express
			background #fff
			display flex
			align-items center
			justify-content space-between
			padding rem(24px) rem(30px);
			border-top rem(1px) solid #e1e1e1
			div
				flex 1
				div
					p
						font-size: rem(28px);
						.name
							font-size: rem(30)px;
							color: #333333;
							margin-right rem(30px);
					.text_info
						margin-bottom rem(20px);
				.address_btn
					flex 1
					font-size: rem(26px);
					color: #333;
		.pay_store
			padding rem(24px) rem(30px);
			border-top rem(1px) solid #e1e1e1
			background #fff
			font-size: rem(28px);
			color: #333333;
		.pose_bg
			position fixed
			top 0
			left:0
			right 0
			bottom 0
			background rgba(0,0,0,.5)
			z-index 10
			.pose_bg_content
				background #fff
				width rem(690px)
				margin rem(240px) auto 0
				padding rem(30px)
				border-radius rem(8px)
				.pose_bg_content_head
					text-align center
					margin-bottom rem(40px)
					font-size rem(30px)
					color:#333
				p
					margin-bottom rem(30px)
					display flex
					align-items center
					span
						margin-right rem(20px)
						font-size rem(26px)
					color:#333
					input
						flex 1
						background #eee
						border none
						line-height rem(64px)
						padding-left rem(20px)
				.btns
					display flex
					margin-top rem(60px)					
					p
						line-height rem(78px)
						border-radius rem(8px)
						font-size rem(28px)
						margin 0 auto
						padding-left:rem(50px)
						padding-right:rem(50px)
					.btn1
						border rem(1px) solid #e1e1e1
						margin-right rem(60px)
					.btn2
						color #fff
						background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
		.list
			margin-bottom rem(16px)
			margin-top rem(16px)
		.order_list
			background #fff
			display flex
			padding rem(30px)
			border-bottom rem(1px) solid #e1e1e1
			.img
				width:rem(140px)
				height rem(140px)
				overflow hiddex
				display flex
				justify-content center
				align-items center
				margin-right rem(16px)
				border-radius rem(8px)
				overflow hidden
				img
					width 100%
					height auto
			.detail
				flex 1
				.detail_name
					maxline(2)
					font-size: rem(28px);
					color: #000000;
					margin-bottom rem(10px)
				.detail_dec
					maxline(2);
					font-size: rem(24px);
					color: #999;
					margin-bottom rem(10px)
				.detail_info
					p,div
						display flex
						justify-content space-between
						align-items center
						margin-top rem(6px)
						.text
							font-size: rem(24px);
							color: #777777;
						.text_1
							font-size: rem(24px);
							color: #b71c20;
				.iconfont
					padding rem(10px);
					font-size rem(38px)
				.count
					margin-left rem(10px);
					margin-right rem(10px);
					font-size rem(28px);
					color #333
					font-weight 700
		.total_info
			padding rem(24px) rem(30px);
			background #fff
			p
				display flex
				justify-content space-between
				align-items center
				margin-bottom rem(20px);
				.text_2
					font-size: rem(24px);
					color: #333333;
				.text_3
					font-size: rem(24px);
					color: #b71c21;
				.text_3_count
					color #333333;
					font-size rem(28px)
			div
				display flex
				justify-content space-between
				align-items center
				border-top rem(1px) solid #c9151e
				padding-top rem(20px);
				.text_2
					font-size: rem(28px);
					color: #333333;
				.text_3
					font-size: rem(28px);
					color: #b71c21;
				.text_3_price
					font-size rem(30px);
					font-weight bold
		.footer
			position fixed
			bottom 0;
			left:0;
			right 0
			background #fff
			height rem(112px);
			display flex
			p
				margin-left rem(20px)
			.left
				flex 1
				text-align left
				padding-right rem(24px);
				padding-left:rem(30px);
				line-height rem(112px)
				display flex
				.text_2
					font-size: rem(30px);
					color: #333333;
					margin-right rem(10px);
					font-weight bold
				.text_3
					font-size: rem(36px);
					color: #b71c21;
					font-weight bold
			.right
				line-height rem(112px);
				width rem(220px);
				text-align center
				font-size: rem(36px);
				color: #ffffff;
				background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
		.pay_bg
			position fixed
			top 0
			left:0
			right 0
			bottom 0
			background rgba(0,0,0,.5)
			.pay_content
				position fixed
				bottom 0
				left 0
				right 0
				background #fff
				border-radius rem(8px) rem(8px) 0 0
				padding-top rem(160px)
				padding-bottom rem(200px)
				text-align center
				.pay_text
					color #b71c21
					font-size rem(48px)
				.pay_btn
					width rem(630px)
					background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
					font-size rem(32px)
					color #fff
					border-radius rem(8px)
					margin 0 auto
					line-height rem(88px)
					margin-top rem(160px)
		.loading_bg
			position fixed
			top 0
			left:0
			right 0
			bottom 0
			background rgba(0,0,0,.5)
			.loading_content
				width rem(360px)
				height rem(360px)
				background #fff
				border-radius rem(8px)
				margin auto
				padding-top rem(148px)
				margin-top rem(400px)
				img
					display block
					width rem(66px)
					height rem(66px)
					background-repeat no-repeat
					margin auto
		.load_bg
			background #fff
			position fixed
			top 0
			left 0
			right 0
			bottom 0
			z-index 100
			img
				display block
				width rem(66px)
				height rem(66px)
				background-repeat no-repeat
				margin auto
				margin-top rem(300px)
</style>
