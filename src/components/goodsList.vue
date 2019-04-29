<template>
  <div class="goods_list">
  	<div class="toast">
  		<p class="toast_text" v-if="isShowToast">{{toast}}</p>
  	</div>
  	<div class="list_type">
  		<div v-for="(item,index) in storeList" :key="item.office.id" @click="changeType(item.office.id,index)">
  			<p :class="{select:typeIndex == index}">{{item.office.name}}</p>
  			<span v-if="typeIndex == index" :class="{select:typeIndex == index}" class="line"></span>
  		</div>
  		<p class="placehold"></p>
  	</div>
  	<div class="content">
  		<div class="content_left">
  			<p v-for="(item,index) in classList" :class="{color:classIndex == index}" :key="index" @click="selectClassType(index,item.value)">
  				{{item.label}}
  			</p>
  		</div>
  		<div class="content_right">
		  	<div class="list" v-if="list && list.length > 0" v-for="(item,index) in list" :key="index">
		  		<div class="img">
		  			<img v-if="contentHttp(item.mainImg)" v-lazy="item.mainImg" alt="img" />
		  			<img v-else v-lazy="$baseUrl2 + item.mainImg" alt="img" />
		  		</div>
		  		<div class="dedial">
		  			<p class="detial_name">{{item.name}}</p>
		  			<div class="detial_count">
		  				<p class="detial_price" v-if="item.price">¥{{item.price}}</p>
		  				<p class="detial_price" v-else>¥{{item.minPrice}} ~ ¥{{item.maxPrice}}</p>
		  				<p class="add_count">
		  					<span class="iconfont icon-jian" v-if="item.amount >= 1" @click.stop="jian(index)"></span>
		  					<span class="count" v-if="item.amount >= 1">&nbsp;&nbsp;{{item.amount}}&nbsp;&nbsp;</span>
		  					<span class="iconfont icon-jian1" @click.stop="add(index)"></span>
		  				</p>
		  			</div>
		  		</div>
			  	<div class="space_bg" v-if="isSpace && Iindex == index"> 
			  		<div class="space_content">
			  			<div class="head">
			  				<span>请选择规格</span>
			  			</div>
			  			<div class="space">
			  				<div v-for="(tpl,spaceIndex) in spaceList" :key="spaceIndex">
				  				<p class="space_text">
				  					<span>{{tpl.specName}}</span>
				  					<span>¥{{tpl.price}}</span>
				  				</p>
				  				<p class="add_count">
			  						<span class="iconfont icon-jian" @click.stop="jianSelectSpace(index,spaceIndex)" :class="{'iconfont-gray':tpl.spaceAmount == 0}"></span>
				  					<span class="count" >&nbsp;&nbsp;{{tpl.spaceAmount}}&nbsp;&nbsp;</span>
				  					<span class="iconfont icon-jian1" @click.stop="addSelectSpace(index,spaceIndex)"></span>
				  				</p>
			  				</div>
			  			</div>
			  			<p class="space_btn"  @click.stop="closeBg">关闭</p>
			  		</div>
			  	</div>
	  		</div>
		  	<noData v-if="!list || list.length == 0" :padding="100"></noData>
	  	</div>
  	</div>
  	<loading v-if="isShowLoading" :padding="100"></loading>
  	<div class="pre_order_list_bg" v-if="isShowPreOrder">
  		<div class="pre_order_list">
  			<p class="head">确认订单</p>
  			<div class="detial">
  				<div v-for="(tpl,index) in dataList" :key="index">
		  			<div class="creat_detial" v-for="(item,index) in tpl.list" :key="index" v-if="item.amount"> 
			  				<p class="text">
			  					<span>{{item.name}}</span>
			  					<span class="count_1" v-if="item.spaceAmount">×{{item.spaceAmount}}</span>
			  					<span class="count_1" v-else>×{{item.amount}}</span>
			  				</p>
			  				<p class="text text_1">
			  					<span v-if="item.spaceName">{{item.spaceName}}</span>
			  					<span v-else></span>
			  					<span class="price">¥{{item.price}}</span>
			  				</p>
		  			</div>
  				</div>
  			</div>
  			<div class="creat_btn">
  				<p class="creat_btn_1" @click="closeOrder">关闭</p>
  				<p class="creat_btn_2" @click="creatOrder">确认</p>
  			</div>
  		</div>
  	</div>
  	<div class="footer">
			<div>
				<p>总数量:&nbsp;{{count}}</p>&nbsp;&nbsp;
				<p>总金额:&nbsp;¥ {{parseFloat(totalPrice).toFixed(2)}}</p>
			</div>
      <p class="btn1" @click="closeOrder()">确认</p>
  	</div>
  	<div class="qrcode-content" v-if="isShowQrcode">
  		<div class="text">
  			<qrcode type="image" :size="qrSize" :cls="qrCls" :value="vCode" background="#fff" id="myqrcode"></qrcode>
  		</div>
  		<p class="qrcode_btn" @click.stop="close">关闭</p>
  	</div>
  	<div class="order_list" @click="toOrderList">
  		订单列表
  	</div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import Vue from 'vue'
import Qrcode from 'v-qrcode/src/index'
import {maxValue,minValue,isContentHttp,contain,stopPull} from '@/common/commonJs'
import loading from '@/components/common/tpl/loading'
import noData from '@/components/common/tpl/noData'
export default {
  name: 'HelloWorld',
  data () {
    return {
    	amount:0,
    	spaceAmount:0,
    	list:"",
    	count:0,//选中总数量
    	totalPrice:0,
    	qrSize:200,
    	qrCls:'qrcode',
    	vCode:"",
    	isShowQrcode:false,
    	categoryId:"",
    	isSpace:false,
    	spaceList:"",
    	Iindex:"",
    	toast:"",
    	isShowToast:false,
    	userId:"",
    	storeList:"",
    	typeIndex:0,
    	storeId:"",
    	isShowLoading:true,
    	classList:"",
    	classIndex:0,
    	classId:"",
    	dataList:[],
    	isShowPreOrder:false,
    	allCount:0,
    	saveList:[]
    }
  },
  methods:{
  	contentHttp(str){
  		return isContentHttp(str)
  	},
  	//商品分类
  	getClasType(){
  		var _this = this
  		this.$http.get(this.$domain + "/goods/getClass").then(function(response){
				if(response.data.result.return_code == "SUCCESS"){
					_this.classList = response.data.list
					if(_this.classList && _this.classList.length > 0){
						_this.classId = _this.classList[0].value
					}
				}
			})
  	},
  	//切换商品分类
  	selectClassType(index,value){
  		this.classIndex = index
  		this.classId = value
  		if(this.classId){
  			this.getList()
  		}
  	},
  	/*店铺列表
  	 */
  	getStoreList(){
  		var _this = this
  		if(this.$cookie.get("YLUSERID")){
	  		this.$http.get(this.$domain + "/goods/getStore?userId=" + this.$cookie.get("YLUSERID")).then(function(response){
	  			_this.isShowLoading = false
					if(response.data.result.return_code == "SUCCESS"){
						_this.storeList = response.data.list
						if(_this.storeList && _this.storeList.length > 0){
							_this.storeId = _this.storeList[0].office.id
							if(_this.storeId && _this.classId){
								_this.getList()
							}
						}
					}
				})
  		}else{
  			_this.isShowLoading = false
  			_this.isShowToast = true
	  		_this.toast = "该用户不存在!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  		}
  	},
  	/*
  	 * 切换分分类
  	 */
  	changeType(id,index){
  		this.typeIndex = index
  		this.classIndex = 0
  		if(this.classIndex == 0 && this.storeList && this.storeList.length > 0){
  			this.storeId = this.storeList[index].office.id
  			this.classId = this.classList[0].value
  		}
  		this.storeId = this.storeList[index].office.id
  		this.count = 0;
  		this.totalPrice = 0;
  		this.dataList = []
  		if(this.storeId && this.classId){
  			this.getList()
  		}
  	},
  	/*产品列表
  	 */
  	getList(){
  		var _this = this;
  		if(this.userId){
  		}else{
  			_this.isShowLoading = false
  			_this.isShowToast = true
  			_this.toast = "该用户不存在!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  				return;
  			},1500)
  		}
  		this.list = "";
  		this.$http.get(this.$domain + "/goods/list?pageNo=1&pageSize=-1&officeId=" + this.storeId 
  			+ "&userId=" + this.userId + "&classId=" + this.classId).then(function(response){
      	if(response.data.result.return_code == "SUCCESS"){
      		_this.isShowLoading = false
      		_this.list = response.data.list;
      		if(_this.list && _this.list.length > 0){
      			_this.list.forEach(function(e){
      				Vue.set(e,"amount",_this.amount)
      				if(e.specs && e.specs.length > 0){
      					var priceArr = [];
      					e.specs.forEach(function(item){
      						Vue.set(item,"spaceAmount",_this.spaceAmount)
      						priceArr.push(item.price)
      					})
      					Vue.set(e,"minPrice",minValue(priceArr))
      					Vue.set(e,"maxPrice",maxValue(priceArr))
      				}
      			})
      			//匹配回显数据
      			var data = "";
      			if(_this.dataList && _this.dataList.length > 0){
      				_this.dataList.forEach(function(item){
      					if(item.classId == _this.classId){
      						data = item.list
      					}
      				})
      				_this.list.forEach(function(item){
      					if(data && data.length > 0){
      						data.forEach(function(e){
      							if(item.id == e.id){
      								if(item.specs && item.specs.length > 0){
      									item.specs.forEach(function(t){
      										Vue.set(item,"amount",e.amount)
      										if(e.spaceId == t.id){
      											Vue.set(t,"spaceAmount",e.spaceAmount)
      										}
      									})
      								}else{
      									Vue.set(item,"amount",e.amount)
      								}
      							}
      						})
      					}
      				})
      			}
      	  }
      	}else{
      		_this.isShowLoading = false
      		_this.isShowToast = true
	  			_this.toast = response.data.result.return_msg
	  			setTimeout(function(){
	  				_this.isShowToast = false
	  				_this.toast = ""
	  			},1500)
      	}
  		})
  	},
  	jian(index){
			var _this = this;
			if(this.list[index].amount > 0){
				this.Iindex = index
				this.count = 0;
	  		this.totalPrice = 0;
	  		if(this.list[index].specs && this.list[index].specs.length > 0){
	  			this.isSpace = true
	  			this.spaceList = this.list[index].specs
	  			this.dataList.forEach(function(item){
						if(item.list && item.list.length > 0){
							item.list.forEach(function(e){
								if(e.spaceAmount){
									_this.count += e.spaceAmount
									_this.totalPrice += e.price*e.spaceAmount
								}else{
									_this.count += e.amount
									_this.totalPrice += e.price*e.amount
								}
							})
						}
					})
	  		}else{
	  			this.list[index].amount--
	  			this.initData(index)
	  		}
			}
  	},
  	add(index){
  		var _this = this;
			this.count = 0;
  		this.totalPrice = 0;
  		this.Iindex = index
  		if(this.list[index].specs && this.list[index].specs.length > 0){
  			this.isSpace = true
  			this.spaceList = this.list[index].specs
				this.dataList.forEach(function(item){
					if(item.list && item.list.length > 0){
						item.list.forEach(function(e){
							if(e.spaceAmount){
								_this.count += e.spaceAmount
								_this.totalPrice += e.price*e.spaceAmount
							}else{
								_this.count += e.amount
								_this.totalPrice += e.price*e.amount
							}
						})
					}
				})
  		}else{
  			this.list[index].amount++
  			this.initData(index)
  		}
  	},
  	//减去规格
  	jianSelectSpace(index,spaceIndex){
  			var _this = this
  			if(this.list[index].specs[spaceIndex].spaceAmount > 0){
	  			this.count = 0;
	  			this.totalPrice = 0;
					this.list[index].amount = 0
					this.spaceList = this.list[index].specs
					this.list[index].specs[spaceIndex].spaceAmount--
					if(this.list[index].specs && this.list[index].specs.length > 0){
						this.list[index].specs.forEach(function(e){
							_this.list[index].amount += e.spaceAmount
						})
						this.initData(index,spaceIndex)
					}
  			}
  	},
  	//添加规格
		addSelectSpace(index,spaceIndex){
			var _this = this
			this.count = 0;
  		this.totalPrice = 0;
			this.list[index].amount = 0
			this.spaceList = this.list[index].specs
			this.list[index].specs[spaceIndex].spaceAmount++
			if(this.list[index].specs && this.list[index].specs.length > 0){
				this.list[index].specs.forEach(function(e){
					_this.list[index].amount += e.spaceAmount
				})
				this.initData(index,spaceIndex)
			}
		},
  	close(){
  		this.isShowQrcode = !this.isShowQrcode
  		this.isShowPreOrder = !this.isShowPreOrder
  	},
  	closeBg(){
  		this.isSpace = false
  		var _this = this
  	},
  	/*处理保存数据*/
  	initData(index,spaceIndex){
  		var _this = this
  		var data = {
	  			classId:"",
	  			list:[]
  			}
  		if(this.list && this.list.length > 0){
  			this.list.forEach(function(item){
	  				data.classId = item.classId
	  				var listItem = {
			  			id:"",
							spaceId:"",
							amount:0,
							spaceAmount:0,
							price:0,
							name:"",
							spaceName:"",
							classId:""
			  		}
	  				if(item.specs && item.specs.length > 0){
	  					item.specs.forEach(function(e){
	  						listItem = {
					  			id:"",
									spaceId:"",
									amount:0,
									spaceAmount:0,
									price:0,
									name:"",
									spaceName:"",
									classId:""
					  		}
  							if(e.spaceAmount > 0){
	  							listItem.amount = item.amount
		  						listItem.id = item.id
			  					listItem.spaceId = e.id
			  					listItem.price = e.price
			  					listItem.spaceAmount = e.spaceAmount
			  					listItem.name = item.name
			  					listItem.spaceName = e.specName
			  					listItem.classId = item.classId
			  					data.list.push(listItem)
  							}
	  					})
	  				}else{
		  					listItem = {
					  			id:"",
									spaceId:"",
									amount:0,
									spaceAmount:0,
									price:0,
									name:"",
									classId:""
					  		}
		  					listItem.id = item.id
		  					listItem.amount = item.amount
		  					listItem.price = item.price
		  					listItem.name = item.name
		  					listItem.classId = item.classId
		  					data.list.push(listItem)
	  					}
  			})
  			if(data.classId){
  				if(this.dataList && this.dataList.length > 0){
  					var index = contain(this.dataList,data)[1]
  					if(contain(this.dataList,data)[0]){
  						this.dataList[index].list = data.list
  					}else{
  						this.dataList.push(data)
  					}
  				}else{
  					this.dataList.push(data)
  				}
  			}else{
  				return
  			}
  			this.count = 0
  			this.totalPrice = 0
  			this.saveList = []
				this.dataList.forEach(function(item){
					if(item.list && item.list.length > 0){
//						_this.saveList = _this.saveList.concat(item.list)
						item.list.forEach(function(e){
							if(e.spaceAmount){
								_this.count += e.spaceAmount
								_this.totalPrice += e.price*e.spaceAmount
							}else{
								_this.count += e.amount
								_this.totalPrice += e.price*e.amount
							}
						})
					}
				})
				//匹配回显数据
  			var data = "";
  			if(_this.dataList && _this.dataList.length > 0){
  				_this.dataList.forEach(function(item){
  					if(item.classId == _this.classId){
  						data = item.list
  					}
  				})
  				_this.list.forEach(function(item){
  					if(data && data.length > 0){
  						data.forEach(function(e){
  							if(item.id == e.id){
  								if(item.specs && item.specs.length > 0){
  									item.specs.forEach(function(t){
  										Vue.set(item,"amount",e.amount)
  										if(e.spaceId == t.id){
  											Vue.set(t,"spaceAmount",e.spaceAmount)
  										}
  									})
  								}else{
  									Vue.set(item,"amount",e.amount)
  								}
  							}
  						})
  					}
  				})
  			}
  		}
  	},
  	closeOrder(){
  		var _this = this
  		if(this.dataList && this.dataList.length > 0){
  			this.isShowPreOrder = !this.isShowPreOrder
  		}else{
  			this.isShowToast = true
				this.toast = "请选择商品!"
				setTimeout(function(){
					_this.isShowToast = false
					_this.toast = ""
				},1500)
				return;
  		}
  	},
  	creatOrder(){
  		var _this = this;
  		var data = [];
  		var item = {}
  		if(this.dataList && this.dataList.length > 0){
  			this.dataList.forEach(function(e){
  				if(e.list && e.list.length > 0){
  					e.list.forEach(function(item){
  						if(item.amount > 0){
  							if(item.spaceId){
  								item = {
										productId:item.id,
										amount:item.spaceAmount,
										specId:item.spaceId
									}
  							}else{
  								item = {
										productId:item.id,
										amount:item.amount
									}
  							}
  							data.push(item)
  						}
  					})
  				}
  			})
  		}
			if(data && data.length > 0){
			}else{
				this.isShowToast = true
				this.toast = "请选择商品!"
				setTimeout(function(){
					_this.isShowToast = false
					_this.toast = ""
				},1500)
				return;
			}
			if(this.userId){
  		}else{
  			_this.isShowToast = true
  			_this.toast = "该用户不存在!"
  			setTimeout(function(){
  				_this.isShowToast = false
  				_this.toast = ""
  			},1500)
  		}
			this.$http.post(this.$domain + "/goods/genCategory?userId=" + this.userId,data).then(function(response){
				if(response.data.result.return_code == "SUCCESS"){
					_this.categoryId = response.data.data
					_this.vCode = window.location.href.split("goodsList")[0] + "order?categoryId=" + _this.categoryId + "&userId=" + _this.userId
					if(_this.count > 0 && _this.vCode){
						_this.isShowQrcode = !_this.isShowQrcode
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
  	toOrderList(){
  		this.$router.push("orderList")
  	}
  },
  mounted(){
  	this.userId = this.$cookie.get("YLUSERID")
  	this.getClasType()
  	this.getStoreList()
  },
  components:{
		Qrcode,
		loading,
		noData
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	.add_count
			display flex
			align-items center
			color #b71c20
			.count
				font-weight bold
				color #333
		.detial_price
			color #b71c20
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
			padding rem(20px) rem(30px)
			background rgba(0,0,0,.7)
	p
		padding 0
		margin 0
	.iconfont
		font-size rem(40px)
	.iconfont-gray
		color #999
	.goods_list
		.list_type
			display flex
			padding-left rem(30px)
			white-space nowrap
			overflow auto
			background #fff
			padding-top rem(16px)
			line-height rem(96px);
			border-bottom rem(1px) solid #e1e1e1
			.placehold
				padding-left rem(2px)
			div
				font-size: rem(30px);
				color: #333;
				border-radius rem(24px);
				margin-right rem(30px);
				padding-left rem(16px);
				padding-right rem(16px)
				p
				line-height rem(88px);
				.line
					display block
					width rem(36px);
					height rem(10px);
					margin 0 auto
					background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
				.select
					color #b71c20
		.list
			flex 1
			display flex
			align-items center
			padding-left rem(30px)
			padding-right rem(30px)
			margin-top:rem(30px)
			.img
				width:rem(140px)
				height rem(140px)
				overflow hidden
				display flex
				align-items center
				margin-right:rem(16px)
				img
					width:100%
					height:auto
			.dedial
				flex 1
				.detial_name
					font-size rem(28px)
					color:#000
					maxline(2)
				.detial_count
					display flex
					justify-content space-between
					align-items center
					margin-top rem(10px)
					font-size rem(28px)
		.footer
			position fixed
			bottom 0;
			left 0
			right 0
			height rem(120px)
			line-height rem(120px)
			align-items center
			display flex
			justify-content space-between
			border-top rem(1px) solid #e1e1e1
			background #fff
			.btn1
				font-size rem(36px)
				width:rem(200px)
				background #b71c20
				color #fff
				height rem(120px)
				line-height rem(120px)
				text-align center
			div
				display flex
				flex 1
				padding-left:rem(30px)
				font-size rem(32px)
				color #000
		.qrcode-content
			position fixed
			bottom 0;
			left 0
			right 0
			top:0;
			background #fff
			text-align center
			padding-top:rem(240px)
			z-index 100
			.text
				padding-left rem(20px)
				margin-left rem(10px)
			.qrcode_btn
				font-size rem(28px)
				width:rem(200px)
				background #b71c20
				color #fff
				height rem(78px)
				line-height rem(78px)
				text-align center
				background #b71c20
				border-radius rem(8px)
				margin rem(100px) auto 0
		.space_bg
			position fixed
			top:0
			left:0
			right:0
			bottom 0
			background rgba(0,0,0,.5)
			z-index 10
			.space_content
				background #fff
				position fixed
				bottom 0
				left:0
				right:0
				z-index 10
				width 100%
				padding 0 rem(30px) rem(30px)
				border-radius rem(8px) rem(8px) 0 0
				.head
					text-align center
					align-items center
					line-height rem(88px)
					font-size rem(30px)
					color #333
				.space
					div
						display flex
						justify-content space-between
						align-items center
						line-height rem(76px)
						.space_text
							width rem(540px)
							display flex
							justify-content space-between
				.space_btn
					width rem(630px)
					line-height rem(76px)
					border-radius rem(8px)
					text-align center
					font-size rem(30px)
					color #fff
					margin rem(150px) auto rem(30px)
					background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
		.order_list
			position fixed
			left 0
			bottom rem(140px)
			width rem(54px)
			font-size: rem(24px);
			padding rem(16px) rem(14)
			background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
			color #fff
			border-radius:0 rem(8px) rem(8px) 0;
		.content
			display flex
			width 100%
			.content_right
				flex 1
				padding-left rem(200px)
				height rem(1100px)
				overflow scroll
				padding-bottom rem(160px)
			.content_left
				width rem(200px)
				border-right rem(1px) solid #e1e1e1
				height rem(1100px)
				overflow scroll
				position absolute
				left 0
				padding-bottom rem(160px)
				p
					line-height rem(100px)
					text-align center
					border-top rem(1px) solid #e1e1e1
					font-size rem(26px)
					color #333
				.color
					color #fff
					background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
		.pre_order_list_bg
			position fixed
			right 0
			left 0
			top 0
			bottom 0
			background rgba(0,0,0,.5)
			z-index 10
			.pre_order_list
				background #fff
				position absolute
				bottom 0
				left 0
				right 0
				border-radius rem(8px) rem(8px) 0 0
				height rem(1000px)
				overflow hidden
				.head
					line-height rem(88px)
					text-align center
					font-size rem(30px)
					color #333
					border-bottom rem(1px) solid #e1e1e1
					position absolute
					top 0
					left 0
					right 0
					background #fff
				.detial
					padding-left rem(40px)
					padding-right rem(40px)
					overflow scroll
					padding-top rem(88px)
					padding-bottom rem(20px)
					height rem(870px)
				.creat_detial
					width 100%
					padding-top rem(20px)
					padding-bottom rem(20px)
					border-bottom rem(1px) solid #e1e1e1
					color #000
					.text
						display flex
						justify-content space-between
						align-items center
						font-size rem(28px)
						color #333
						.count_1
							font-size rem(28px)
							font-weight bold
					.text_1
						color #999
						font-size rem(24px)
						margin-top rem(10px)
						.price
							color #b71c20
							font-size rem(28px)
				.creat_btn
					display flex
					justify-content center
					position fixed
					bottom 0
					left 0
					right 0
					background #fff
					padding-bottom rem(30px)
					padding-top rem(20px)
					border-top rem(1px) solid #e1e1e1
					p
						width rem(220px)
						line-height rem(76px)
						font-size rem(28px)
						text-align center
						border-radius rem(8px)
					.creat_btn_1
						color #333
						border rem(1px) solid #999
						margin-right rem(100px)
					.creat_btn_2
						color #fff
						background-image linear-gradient(45deg, rgb(150,20,20) 0%, rgb(240,50,50) 100%)
</style>
