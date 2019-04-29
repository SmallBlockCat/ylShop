<template>
  <div class="login">
  	<wechatAuth></wechatAuth>
  	<div class="head">
			清除成功！
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
    }
  },
  methods:{
  },
  mounted(){
  	//数据问题清缓存
		this.$cookie.set('YLUSERID',"",30)
	 	this.$cookie.set('name',"",30)
  },
  components:{
		wechatAuth,
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	.head
		text-align center
		font-size rem(64px)
		margin rem(240px) auto
		color #333
</style>
