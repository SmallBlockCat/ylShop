<template>
    <div class="myhidden" v-show="isshow">
    	<p>i am wechatAuth</p>
    </div>
</template>
<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import {uuid} from '@/common/commonJs'
    export default {
        name: 'wechatAuth',
        data() {
        	return {
        		isshow:false
        	}
        },
        props:['guideUser','empty'],
        mounted() {
            this.appid = this.$route.query.appid ? this.$route.query.appid : this.$appid
//          this.$emit("currentAppid",this.appid)
            this.$cookie.set('appid', this.appid, 30);
            var openid = this.$cookie.get(this.appid+'_openid');
            var userId = this.$cookie.get('YLUSERID')
            
            if (userId && openid) { //openid 和 userId 两个同时存在不做授权
            }else{
            	var index1 = ""
            	if(document.URL.indexOf('&code=') != -1){
            		index1 = document.URL.indexOf('&code=')
            	}else{
            		index1 = document.URL.indexOf('code=')
            	}
            	var index2 = document.URL.indexOf('WEIXIN') + 6
            	var toempty = document.URL.slice(index1,index2)
               	this.$cookie.set('referrer',document.URL.replace(toempty,''), { expires: '2h'});
               	this.getOpenId()
//             	window.location.href = this.$authUrl + "?appid=" + appid;
            }
        },
        methods:{
        	getOpenId(){
        		//判断微信客户端
        		var ua = window.navigator.userAgent.toLowerCase()
        		if (ua.indexOf('micromessenger') > 1) {
        			if (document.URL.indexOf('code=') > 0&&document.URL.indexOf('state=WEIXIN') > 0) {
        				var code = document.URL.substring(document.URL.indexOf('code=')+5,document.URL.indexOf('&state'));
        				this.$http.get(this.$baseUrl2 + '/ylshoph5/api/auth?code='+code+'&appid='+this.appid)
        				.then((res) => {
        					if(res.data.result.return_code == "SUCCESS"){
								this.$cookie.set(this.appid+'_openid',res.data.data.openid,30)
								this.$cookie.set('YLUSERID',res.data.data.id,30)
								let refer = this.$cookie.get('referrer')
								this.$cookie.delete('referrer')
								//触发成功授权事件
								window.location.href = decodeURIComponent(refer);
								
								
        					}else{
        						console.log(res)
        					}
        				})
        			}else{
        				window.location.href = this.$baseUrl2 + '/ylshoph5/static/get_wechat_code.html?appid='+this.appid+'&redirect_uri='+encodeURIComponent(document.URL)+'&scope=snsapi_base&state=WEIXIN'
//						window.location.href = this.$baseUrl2 + '/get-weixin-code.html?appid='+this.appid+'&redirect_uri='+encodeURIComponent(document.URL)+'&scope=snsapi_base&state=WEIXIN'
        			}
        		}else{
					alert("请在微信中打开")
        		}
        	}
        }
    }
</script>
<style scoped>
</style>
