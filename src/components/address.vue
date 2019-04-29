<template>
  <div class="address">
  	<div class="toast">
  		<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  	</div>
  	<p class="head">添加收货地址</p>
  	<div class="text">
  		<p>收货人</p>
  		<input type="text" v-model="name" placeholder="请输入收货人姓名" @blur="loseBlur"/>
  	</div>
  	<div class="text">
  		<p>联系电话</p>
  		<input type="number" v-model="phone" placeholder="请输入收货人电话" @blur="loseBlur"/>
  	</div>
  	<div class="text_2" @click="selectAddress">
  		<p><span class="text_2_1">所在地区</span>
  			<span class="text_2_2 address" v-if="address">{{address}}</span>
  			<span v-else class="text_2_2">请选择</span>
  		</p>
  		<span class="iconfont icon-arrow-sl"></span>
  	</div>
  	<div>
  		<textarea name="" rows="" cols="" v-model="addr" @blur="loseBlur" placeholder="请补充详细收货地址，如街道、门牌号、楼层及房间号等"></textarea>
  	</div>
  	<div class="bg" v-if="isShowBg" @click="closeBg">
  		<div class="bg_content">
  			<div class="bg_content_fixed">
  				<p class="head">送至</p>
  				<div class="content">
  					<div class='head'>
  						<div class="item_text" v-if="addrList" v-for="item in addrList">
  							<p>{{item}}</p>
  							<span></span>
  						</div>
  						<div class="item">
  							<p>请选择</p>
  							<span></span>
  						</div>
  					</div>
  				</div>
  			</div>
			<div class="list">
				<div class="head" v-if="isShowCity" v-for="(item,index) in cityList" :key="index" @click.stop="selectCity(index)">
					<p :class="{color:cityIndex != null && cityIndex == index}">{{item.name}}</p>
					<span v-if="cityIndex != null && cityIndex == index" class="iconfont icon-dian-copy-copy-copy"></span>
				</div>
				<div class="head" v-if="isShowArea" v-for="(item,index) in areaList" :key="index" @click.stop="selectArea(index)">
					<p :class="{color:areaIndex != null && areaIndex == index}">{{item}}</p>
					<span v-if="areaIndex != null && areaIndex == index" class="iconfont icon-dian-copy-copy-copy"></span>
				</div>
			</div>
  		</div>
  	</div>
  	<p class='add_btn' @click="addInfo">确认</p>
  </div>
</template>

<script>
import Vue from 'vue'
import {address} from '@/common/js/address.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
    	toast:"",
    	isShowToast:false,
    	name:"",
    	phone:"",
    	addr:"",
    	list:"",
    	addrList:[
    		"浙江"
    	],
    	cityIndex:null,
    	cityList:"",
    	areaList:"",
    	isShowCity:true,
    	isShowArea:false,
    	areaIndex:null,
    	isShowBg:false,
    	address:"",
    	userId:"",
    	province:"",
    	city:"",
    	counties:""
    }
  },
  methods:{
  	selectAddress(){
  		this.isShowBg = true
  		this.isShowCity=true
    	this.isShowArea=false
    	this.address = ""
  		this.addrList = ["浙江"]
  	},
  	loseBlur(){
  		var odiv=document.createElement('div')
	    odiv.style.height="999px"
	    document.body.appendChild(odiv)
	    setTimeout(()=>{
	        odiv.parentNode.removeChild(odiv)
	    },0)
  	},
  	selectCity(index){
		this.cityIndex = index
		this.addrList.push(this.cityList[index].name)
		this.isShowCity = false
		this.isShowArea = true
		this.areaList = this.cityList[index].areaList
  	},
  	selectArea(index){
  		this.areaIndex = index
  		this.addrList.push(this.areaList[this.areaIndex])
  		this.isShowBg = false
  		var _this = this
  		if(this.addrList && this.addrList.length > 0){
  			this.addrList.forEach(function(e){
  				_this.address += e
  			})
  		}
  	},
  	addInfo(){
  		var _this = this
  		if(this.userId){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "用户ID不存在"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  				return;
  			},1500)
  		}
  		if(this.name){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "请填写收货人姓名"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		if(this.phone){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "请填写联系电话"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		if(this.addrList){
  			this.province = this.addrList[0]
  			this.city = this.addrList[1]
  			this.counties = this.addrList[2]
  		}else{
  			_this.isShowToast = true
  			_this.toast = "请选择地址"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		if(this.addr){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "请填写详细地址"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  			return;
  		}
  		var data = {
		    "userId": this.userId,
		    "name": this.name,
		    "phone": this.phone,
		    "province": this.province,
		    "city": this.city,
		    "counties": this.counties,
		    "address": this.addr,
		    "defaultType": "1"
		}
  		this.$http.post(this.$domain + "/express/save",data).then(function(response){
	      	if(response.data.result.return_code == "SUCCESS"){
	      		_this.$router.push({path:"payOrder",query:{"id":_this.$route.query.id,"recommend":_this.$route.query.recommend,"from":"address"}})
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
  	closeBg(){
  		this.isShowBg = false
  	}
  },
  mounted(){
  	this.userId = this.$cookie.get("YLUSERID")
  	if(address){
  		this.list = address
  		this.cityList = this.list.cityList
  	}
  },
  components:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	.iconfont
		color #b71c20
		font-size rem(38px)
	.color
		color #b71c20 !important
	p
		margin 0
		padding 0
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
	.address
		.head
			line-height rem(88px)
			text-align center
			font-size: rem(36px);
			color: #333;
			border-bottom rem(1px) solid #e1e1e1
		.text
			padding-left rem(30px);
			padding-right rem(30px);
			line-height rem(88px);
			display flex
			align-items center
			border-bottom rem(1px) solid #e1e1e1
			p
				font-size: rem(30px);
				color: #333;
				width rem(130px)
			input
				height rem(64px);
				flex 1
				border none
				padding-left rem(50px);
				line-height rem(64px);
				font-size: rem(30px);
		.text_2
			line-height rem(88px);
			padding-left rem(30px);
			padding-right rem(30px);
			line-height rem(88px);
			display flex
			align-items center
			justify-content space-between
			font-size: rem(30px);
			color: #333;
			border-bottom rem(1px) solid #e1e1e1
			.text_2_1
				width rem(130px);
			.text_2_2
				color: #999999;
				margin-left rem(60px)
			.address
				color: #333;
		textarea
			border none
			width 100%
			height rem(200px)
			padding rem(30px)
			font-size: rem(30px);
			color: #333;
		.bg
			position fixed
			top 0
			bottom 0
			left 0
			right 0
			background rgba(0,0,0,.5);
			.bg_content
				background #fff
				width 100%
				height rem(1000px);
				position fixed
				bottom 0
				left 0
				right 0
				.bg_content_fixed
					position absolute
					top 0
					left 0
					right 0
					background #fff
					.head
						line-height rem(88px);
						text-align center
						font-size: rem(30px);
						color: #999999;
					.content
						.head
							text-align left
							padding-left rem(30px);
							display flex
							.item_text
								font-size: rem(30px);
								color: #333;
								margin-right rem(30px)
							.item
								p
									font-size: rem(30px);
									color: #b71c21;
								span
									display block
									width rem(36px);
									height rem(10px);
									margin 0 auto
									background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%);
				.list
					margin-top rem(184px);
					overflow-y scroll
					height rem(816px)
					.head
						line-height rem(88px);
						border-bottom rem(1px) solid #e1e1e1
						display flex
						align-items center
						justify-content space-between
						padding-left rem(30px);
						padding-right rem(30px)
						span
							color: #b71c21;
						p
							font-size: rem(30px);
							color: #666666;
	.add_btn
		width rem(630px);
		line-height rem(88px);
		font-size: rem(36px);
		color: #ffffff;
		background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%);
		border-radius rem(8px);
		margin 0 auto
		text-align center
		margin-top rem(420px)
</style>
