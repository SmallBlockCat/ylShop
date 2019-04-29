<template>
	<div class="loading" :style="setPadding">
		<img src="../img/load.gif" alt="" />
	</div>
</template>

<script>
	export default {
		props:{
			padding:{
				type:Number,
				default:20
			},
		},
		computed:{
			setPadding(){
				return `padding:${this.padding}px 0;`
			},
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped="scoped">
	@import "~common/stylus/mixin.styl"
	.loading
		width 100%
		text-align center
		/*background #eee*/
		height 100vh
		img
			width rem(66px)
			height rem(66px)
			background-repeat no-repeat
</style>