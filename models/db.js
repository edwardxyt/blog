var settings = require('../settings'),
	Db = require('mongodb').Db,  //数据库的DB对象
	Connection = require('mongodb').Connection,  //
	Server = require('mongodb').Server;  //连接数据库
	//实例化个数据库DB对象（‘博客’，‘连接数据库’，参数）
module.exports = new Db(settings.db, new Server(settings.host, settings.port), {
	safe: true
});