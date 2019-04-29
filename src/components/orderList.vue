<template>
	<div class="order">
		<div class="toast">
  			<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  		</div>
  		<div class="head">
  			<p class="order_head">我的订单</p>
  			<div class="order_type">
	  			<div class="type" v-for="(item,index) in statusType" :key="index" @click="change(index,item.status)">
	  				<p :class="{select:currenIndex == index}">{{item.text}}</p>
	  				<span v-if="currenIndex == index"></span>
	  			</div>
  			</div>
  		</div>
		<div class="list" v-if="orderList && orderList.length > 0"  ref="wrapper">
			<div class="item" v-for="(item,index) in orderList" :key="index" @click="toDetial(index)">
				<div class="item_top" v-if="item.orderNo">
					订单编号:{{item.orderNo}}
				</div>
				<div class='item_center' v-if="item.orderDetailList && item.orderDetailList.length > 0">
					<div class="img">
						<img v-if="contentHttp(item.orderDetailList[0].mainImg)" v-lazy="item.orderDetailList[0].mainImg" alt="img" />
						<img v-else v-lazy="$baseUrl2 + item.orderDetailList[0].mainImg" alt="img" />
					</div>
					<div class="text">
						<div>
							<p class='name'>{{item.orderDetailList[0].productName}}</p>
							<p class="type color_3" v-if="item.sendType == 1">快递配送</p>
							<p class="type color_3" v-if="item.sendType == 3">在线支付</p>
						</div>
						<p class="space" v-if="item.orderDetailList[0].specName">规格 : {{item.orderDetailList[0].specName}}</p>
					</div>
				</div>
				<div class="item_bottom">
					<p v-if="item.amount">共 <span>{{item.amount}}</span> 件商品</p>
					<p>
						<span class="pay_type" v-if="item.orderStatus == 0">待付款 : </span>
						<span class="pay_type" v-if="item.orderStatus == 1">已付款 : </span>
						<span class="pay_type" v-if="item.orderStatus == 7">已发货 : </span>
						<span class="pay_type" v-if="item.orderStatus == 8">已完成 : </span>
						<span>¥{{item.orderTotalPrice}}</span>
					</p>
				</div>
			</div>
		</div>
		<!--<div class="load_more" v-if="isLoadMore" @click="loadMore">加载更多</div>
		<div class="no_more" v-else>- 没有更多了-</div>-->
		<load-more tip="正在加载" v-if="isShowLoadMore"></load-more>
		<loading v-if="isShowLoading" :padding="100"></loading>
	  <div class="order_list" v-if="!orderList || orderList.length == 0">
	  	<span class="iconfont icon-dingdan3"></span>
	  	<p>暂无数据</p>
	  </div>
	  <!--<foot></foot>-->
	</div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { LoadMore} from 'vux'
import Vue from 'vue'
//import foot from '@/components/common/tpl/foot'
import loading from '@/components/common/tpl/loading'
import {isContentHttp} from '@/common/commonJs'
export default {
  name: 'HelloWorld',
  data () {
    return {
    	toast:"",
    	isShowToast:false,
    	isShowLoading:true,
    	pageNo:1,
    	pageSize:-1,
    	isShowLoadMore:false,
    	isLoadMore:true,
    	orderList:[],
    	list:"",
    	orderStatus:1,
    	statusType:[
    		{"text":"已付款","status":1},
    		{"text":"待付款","status":0},
    		{"text":"已发货","status":7},
    		{"text":"已完成","status":8}
    	],
    	currenIndex:0,
    	urlText:"",
    	userType:""
    }
  },
  methods:{
  	contentHttp(str){
  		return isContentHttp(str)
  	},
  	getList(){
	  	var _this = this
	  	if(this.$cookie.get("YLUSERID") && this.$cookie.get('name')){
	  	}else{
	  		_this.isShowToast = true
				_this.toast = "用户账号不存在!"
				setTimeout(function(){
					_this.isShowToast = false
					_this.toast = ""
					_this.isShowLoading= false
					return;
				},1500)
	  	}
	  	this.$http.get(this.$domain + "/order/listOrderByPage?pageNo="+ this.pageNo +"&pageSize="+ this.pageSize
	  		+"&" + this.urlText + "=" + this.$cookie.get("YLUSERID") + "&orderStatus=" + this.orderStatus).then(function(response){
		  	_this.isShowLoading= false
	      	if(response.data.result.return_code == "SUCCESS"){
	      		_this.orderList = response.data.data
	      		if(_this.orderList && _this.orderList.length > 0){
	      			_this.orderList.forEach(function(e){
	      				var amount = 0;
	      				if(e.orderDetailList && e.orderDetailList.length > 0){
	      					e.orderDetailList.forEach(function(item){
	      						amount += item.amount
	      					})
	      				}
	      				Vue.set(e,"amount",amount)
	      			})
	      		}
	      	}else{
	      		_this.isShowLoading= false
	      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
	      	}
	  	})
  	},
  	toDetial(index){
  		if(this.orderList[index].orderNo){
  			this.$router.push({path:"orderDetaIl",query:{"orderNo":this.orderList[index].orderNo}})
  		}
  	},
  	change(index,status){
  		this.orderStatus = status
  		this.currenIndex = index
  		this.getList()
  	}
  },
  mounted(){
  	var _this = this
  	if(this.$cookie.get("userType")){
  		this.userType = this.$cookie.get("userType")
  		if(this.userType == 1){//药代
  			this.urlText = "agent"
  		}else if(this.userType == 2){//医生
  			this.urlText = "recommend"
  		}else if(this.userType == 3){//药店
  			this.urlText = "seller"
  		}
  		this.getList()
  	}else{
  		this.isShowToast = true
		this.toast = "用户账户身份不存在"
		setTimeout(function(){
			_this.isShowToast = false
			_this.toast = ""
		},1500)
  		this.isShowLoading= false
  	}
  },
  components:{
//		foot,
		loading,
		LoadMore,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	p
		margin 0
		padding 0
.order
	background #f2f2f2
	height 100vh
	padding-top rem(194px)
	padding-bottom rem(30px)
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
	.head
		position fixed
		top 0
		left 0
		right 0
		.order_head
			line-height rem(88px)
			text-align center
			color #333
			font-size rem(30px)
			background #fff
			border-bottom rem(1px) solid #e1e1e1
		.order_type
			line-height rem(96px);
			background #fff
			display flex
			justify-content space-around
			padding-left rem(30px);
			padding-right rem(30px)
			font-size: rem(30px);
			color: #333;
			div
				width rem(160px);
				p
					text-align center
				span
					display block
					width rem(36px);
					height rem(10px);
					margin 0 auto
					background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%);
				.select
					color #b71c20
	.order_list
		color #999
		text-align center
		padding-top rem(200px)
		p
			font-size rem(30px)
			margin-top rem(20px)
		.icon-dingdan3
			font-size rem(100px)
	.list
		.item
			padding-left rem(30px)
			padding-right rem(30px)
			margin-top rem(16px)
			background #fff
			.item_top
				line-height rem(76px)
				border-bottom rem(1px) solid #e1e1e1
				font-size rem(24px)
				color #777
			.item_center
				padding-top rem(16px)
				padding-bottom rem(16px)
				display flex
				.img
					width rem(140px)
					height rem(140px)
					display flex
					justify-content center
					align-items center
					overflow hidden
					border-radius rem(8px)
					margin-right rem(24px)
					img
						width 100%
						height auto
				.text
					flex 1
					div
						display flex
						justify-content space-between
						.type
							width rem(130px)
							border-radius rem(16px);
							text-align center
							max-height rem(50px);
							line-height rem(50px)
							margin-left rem(10px);
						.color_1
							color #09c4ac;
							border rem(1px) solid #09c4ac
						.color_2
							color #f2952c;
							border rem(1px) solid #f2952c
						.color_3
							color #b71c20;
							border rem(1px) solid #b71c20
						.name
							flex 1
							font-size rem(28px)
							color #333
							maxline(2)
							margin-top rem(10px)
					.space
						font-size rem(24px)
						color #999
						margin-top rem(10px)
			.item_bottom
				display flex
				justify-content space-between
				line-height rem(64px)
				p
					font-size: rem(26px);
					color: #666666;
					span
						color #b71c20
					.pay_type
						color #999
	.load_more
		width rem(300px);
		line-height rem(64px);
		border rem(1px) solid #e1e1e1
		color #999
		text-align center
		font-size rem(28px);
		margin rem(46px) auto
		background #fff
	.no_more
		font-size rem(28px);
		margin rem(46px) auto
		color #999
		text-align center
</style>
