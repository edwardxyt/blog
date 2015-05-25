var express = require('express');  //框架
var path = require('path');  //路径
var favicon = require('serve-favicon');  //favicon
var logger = require('morgan');  //log
var cookieParser = require('cookie-parser');  //cookie
var bodyParser = require('body-parser');  //json
var session = require('express-session');  //session
var MongoStore = require('connect-mongo')(session);  //链接mongo
var flash = require('connect-flash');  //提示
var multer  = require('multer');   //上传

var routes = require('./routes/index');  //路由模块 自定义模块
var settings = require('./settings');   //数据库配置

var fs = require('fs');    //文件
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});    //访问日志
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});    //错误日志

var app = express();    //APP实例化

app.set('port', process.env.PORT || 3000);  //获取环境变量
// 视图引擎设置
app.set('views', path.join(__dirname, 'views'));  //模板位置 __dirname存储当前正在执行的脚本所在的目录
app.set('view engine', 'ejs');
//app.engine('.html', require('ejs').__express);  //重新设置模板文件的扩展名

// 将您的图标放在严后取消注释
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));    //日志中间件
app.use(logger({stream: accessLog}));   //保存日志文件
app.use(bodyParser.json());    //加载解析JSON中间件
app.use(bodyParser.urlencoded({ extended: true }));    //加载urlencoded中间件
app.use(multer({    //上传图片
	dest: './public/images',
	rename: function (fieldname, filename) {
		return filename;
	}
}));
app.use(cookieParser());    //加载COOKIE中间件
app.use(express.static(path.join(__dirname, 'public')));    //设置静态文件的目录

//会话
app.use(session({
	secret: settings.cookieSecret,  //防止篡改Cookie
	key: settings.db,//cookie name
	cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
	store: new MongoStore({
		db: settings.db,
		host: settings.host,
		port: settings.port
	})
}));
app.use(flash());
routes(app);

//记录错误日志
app.use(function (err, req, res, next) {
	var meta = '[' + new Date() + '] ' + req.url + '\n';
	errorLog.write(meta + err.stack + '\n');
	next();
});

//输出端口
app.listen(app.get('port'),'0.0.0.0', function(){
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
