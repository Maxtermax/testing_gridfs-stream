var	registros=require('morgan')
,		bodyParser=require('body-parser')
,		methodOverride=require('method-Override')
,		file=require('multer');


module.exports={
	logs:registros,
	file:file,
	Ajax:bodyParser,
	Ajax_Update:methodOverride
}
