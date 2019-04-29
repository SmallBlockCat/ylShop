var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),//自动兼容
	watch = require('gulp-watch'),//修改监听
	mincss = require('gulp-minify-css'),//压缩CSS
	sequence = require('gulp-sequence'),//多任务并行
	imagemin = require('gulp-imagemin'),//图片压缩
	pngquant = require('imagemin-pngquant'),//图片深度压缩
	cache = require('gulp-cache'),//只压缩修改的图片
	rename = require('gulp-rename'),
	postcss = require('gulp-postcss'),
//	px2rem = require('postcss-px2rem');//将css中的px转换成rem
	stylus = require('gulp-stylus'),
//	px3rem = require('gulp-px3rem')
	pxtorem = require('postcss-pxtorem'),
	pxtoviewport = require('postcss-px-to-viewport');//px转换成vm，vh
var path = "css";
gulp.task('two',function(){
//	var processors = [
//      pxtoviewport({
//          viewportWidth: 750,
//          viewportHeight: 1334,
//      })
//  ];
	var processors = [
		pxtorem({
			rootValue: 75,
			unitPrecision: 5,
			propList: ['*'],
			selectorBlackList: [],
			replace: true,
			mediaQuery: false,
			minPixelValue: 12
		})
	];//基准
	gulp.src('css/saleStore.css')
		.pipe(watch('css/saleStore.css'))
//		.pipe(px3rem())
		.pipe(autoprefixer({
			browsers:[
				'last 2 versions',
				'Android >= 4.0',
				'last 1 Chrome versions',
				'last 2 Explorer versions',
				'last 3 Safari versions',
				'Firefox >= 20',
				'iOS 7',
				'Firefox ESR',
				'> 1%'
			],
			cascade:true,
			remove:true
		}))
		.pipe(mincss({
			advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepBreaks: true//类型：Boolean 默认：false [是否保留换行]
		}))
		.pipe(rename({
			suffix:"-min"
		}))
//		.pipe(postcss(processors))
		.pipe(gulp.dest('css'));
});
gulp.task('one', function () {
  return gulp.src('assets/css/website.styl')
    .pipe(watch('assets/css/website.styl'))
    .pipe(stylus())
    .pipe(gulp.dest('assets/css'));
});
gulp.task('imgmin',function(){
	gulp.src('nanfeng/img/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
		})))
		.pipe(gulp.dest('nanfeng/img/dist'));
});
gulp.task('default',['imgmin','one','two']);


gulp.task('imgmin',function(){
	gulp.src('nanfeng/img/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
		})))
		.pipe(gulp.dest('nanfeng/img/dist'));
});
gulp.task('fixed',function(){
	gulp.src('nanfeng/css/*.css')
		.pipe(watch('nanfeng/css/*.css'))
		.pipe(autoprefixer({
			browsers:[
				'last 2 versions',
				'Android >= 4.0',
				'last 1 Chrome versions',
				'last 2 Explorer versions',
				'last 3 Safari versions',
				'Firefox >= 20',
				'iOS 7',
				'Firefox ESR',
				'> 5%'
			],
			cascade:true,
			remove:true
		}))
		.pipe(mincss({
			advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepBreaks: true//类型：Boolean 默认：false [是否保留换行]
		}))
		.pipe(gulp.dest('nanfeng/css/fixed'));
});
