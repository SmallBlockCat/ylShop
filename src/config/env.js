/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
let baseUrl; 
let routerMode;
let baseUrl2;
//const imgBaseUrl = 'https://fuss10.elemecdn.com';
let appid;

if (process.env.NODE_ENV == 'development') {
	appid ='wx20237a8d15371a3d';
} else if (process.env.NODE_ENV == 'test') {
	appid ='wxda948ad94018ca8e';
} else {
	appid ='wxda948ad94018ca8e';
}

if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://192.168.2.229:8080/ylshoph5';
	routerMode = 'hash'
	baseUrl2='http://192.168.2.229:8080'
} else if(process.env.NODE_ENV == 'test') {
	baseUrl = '/ylshoph5';
	routerMode = 'hash'
	baseUrl2='http://uat.cloudlin.cn';
} else{
	baseUrl = '/ylshoph5'
	routerMode = 'hash'
	baseUrl2='http://www.cloudlin.cn'
}

export {
	baseUrl,
	routerMode,
//	imgBaseUrl,
	baseUrl2,
	appid
}
