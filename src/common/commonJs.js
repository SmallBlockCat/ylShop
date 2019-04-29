import VueCookie from 'vue-cookie'
import axios from 'axios'

const getLink = function(link){
	//?t=${(new Date()).valueOf()}
	//`http:/\/${window.location.host}/tour/static/tourism/dist?t=${(new Date()).valueOf()}#/`
	if(link){
		return `${window.location.href.split("/static")[0]}/static/tourism/dist/?t=${(new Date()).valueOf()}#/${link}`
	}else{
		return `${window.location.href.split("/static")[0]}/static/tourism/dist/?t=${(new Date()).valueOf()}#/`
	}
}
//混肴密码方法
const randomString = function(passWord){
	let ps = passWord.split('');
	let len = ps.length*2;
	let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz,randomPoz+1);
	}
	let rs = randomString.split('');
	for(var i = 0;i < randomString.length;i++){
		if(i%2 === 0){
			rs[i] = ps[i/2];
		}
	}
	return rs.join("");
}
//清空cookie
const createCookie = function(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
     if(keys) {  
        for(var i = keys.length; i--;)  
		createCookie(keys[i],"",-1);
	}
}

//字符转义
const formatItem = function(html){
	if (html != null) {
		html = html.replace(/&amp;/g, '&')
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, "\'")
		.replace(/&yen;/g, "￥")
		.replace(/&nbsp;/g, "")
		.replace(/&iexcl;/g,"?")
		.replace(/&laquo;/g,"?")
		.replace(/&not;/g,"?")
		.replace(/&middot;/g,"·")
		.replace(/&cent;/g,"￠")
		.replace(/&brvbar;/g,"|")
		.replace(/&sect;/g,"§")
		.replace(/&reg;/g,"®")
		.replace(/&macr;/g,"-")
		.replace(/&deg;/g,"°")
		.replace(/&copy;/g,"©")
		.replace(/&uml;/g,"¨")
		.replace(/&plusmn;/g,"±")
		.replace(/&ndash;/g,"-")
		.replace(/&mdash;/g,"-")
		.replace(/&#39;/g,"\'");
	}
	return html;
}
//去重公共方法
const contain = function(Arry,val){
	var containI = "";
	for (var  i  =  0,len = Arry.length;  i  <  len;  i++)       {         
		if (Arry[i].classId  ==  val.classId)         {  
			containI = i       
			return  [true,i];        
		}      
	}       
	return  [false,containI];  
}

//根据日期获取对应星期几
//date 格式如:2018-5-29
//const weekDate = function(date){
//	let weekName
//	let week
//	let weekNum
//	if(date){
//		week = ['日', '一', '二', '三', '四', '五', '六'];
//		weekNum = new Date(date).getDay();
//		weekName = week[weekNum]
//	}
//	return weekName;
//}
//initData 公共调接口方法
/*
 * 
 */
const initDatas = function(url,type,data,
				errorMsgString = "error"){
	//可自定义错误信息的对象
	const errorMsgObj = {
		error:null,
		msg:errorMsgString
	}
	return new Promise(function(resolve,reject){
		axios({
			url:url,
			method:type,
			data:data
		}).then(function(res){
			if(res.data.meta.success){
				resolve(res)
			}else{
				errorMsgObj.error = res
				errorMsgObj.msg = "接口返回失败"
				reject(errorMsgObj)
			}
		}).catch(function(error){
			errorMsgObj.error = error
			errorMsgObj.msg = "接口错误!"
			
			reject(errorMsgObj)
		})
	})
}
				
//生成唯一的UUID
const uuid = function(){
	var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 16; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23];
 
    var uuid = s.join("");
    return uuid;
}
const handleScroll = function(){
    var searchBarFixed = true
	var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
	var offsetTop = document.querySelector('#content_id').offsetTop
	if (scrollTop > offsetTop) {
	    searchBarFixed = true
	} else {
	    searchBarFixed = false
	}
	return searchBarFixed
}
//js 保留两位小数方法
const newTofixed = function( num,digital){  
	return ( Math.round( num * Math.pow( 10,digital ) ) / Math.pow( 10,digital ) ).toFixed(digital);
}  


const currency = function(currencyName){
	if(currencyName != null || currencyName){
		currencyName = currencyName.replace('HKD', 'HK$')   //港币
			.replace('JPY', '￥')   //日元
			.replace('KRW', '₩')   //韩元
			.replace('MYR', 'RM')  //林吉特
			.replace('IDR', 'Rp')  //印尼盾
			.replace('VND', '₫')   //越南盾
			.replace('THB', '฿')   //泰铢
			.replace('CNY', '¥')   //人民币
			
	}
	return currencyName;
}
const splitString = function(string,index){
	if(string){
		var splitString = 	string.split('|')[index]
	}
	return splitString;
}
//根据滚动距离定位左侧分类
const compare = function(num,arry){
	var j = 0;
	var indexArry = [0];
	var len = 0;
	if(num && arry && arry.length > 0){
		for(var i = 0; i < arry.length ; i++){
			if((num) > arry[i] || (num) == arry[i]){
				indexArry.push(i + 1)
			}
		}
		len = indexArry.length;
	}
	return indexArry[len-1];
}
  /*qq
  * 判断是否包含http,拼接链接
  */
var host = window.location.host;
const indexHttp = function(str){
	if(str.indexOf("http") > -1){
		return str;
	}else{
		return host + str;
	}
}
//获取数组中的最大值
const maxValue = function(arry){
	if(arry && arry.length >= 2){
		var max = Math.max.apply(null, arry);
	}
	return max;
}
//获取数组中的最小值
const minValue = function(arry){
	if(arry && arry.length >= 2){
		var min = Math.min.apply(null, arry);
	}
	return min;
}
//判断地址中是否含有http
const isContentHttp = function(str){
	if(str.indexOf("http") > -1){
		return true;
	}else{
		return false;
	}
}

//下拉禁止查看地址
const stopPull = function(){
	console.log("444444")
	var lastY;//最后一次y坐标点
    $(document.body).on('touchstart', function(event) {
        lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
    });
    $(document.body).on('touchmove', function(event) {
        var y = event.originalEvent.changedTouches[0].clientY;
        var st = $(this).scrollTop(); //滚动条高度  
        if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
            lastY = y;
            event.preventDefault();
        }
        lastY = y;
    });
}
export {
	getLink,
	randomString,
	createCookie,
	formatItem,
	contain,
	initDatas,
	uuid,
	handleScroll,
	newTofixed,
	currency,
	splitString,
	compare,
	indexHttp,
	maxValue,
	minValue,
	isContentHttp,
	stopPull
}
