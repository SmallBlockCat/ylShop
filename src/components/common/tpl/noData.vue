<template>
	<div class="loading" :style="setPadding">
		<img src="../img/ufoData@2x.png" alt="" />
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
		flex 1
		width rem(550px)
		text-align center
		/*background #eee*/
		img
			width rem(210px)
			height rem(210px)
			background-repeat no-repeat
</style>