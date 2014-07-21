var mongoose=require('mongoose');//mongoose driver 
var fs=require('fs');
var express=require('express')//express 4
var app=express();
var server=require('http').createServer(app)
var	middlewares=require('./dependencies/express-middleware.js');
var Grid = require('gridfs-stream');
var mongoID=require('mongodb').ObjectID

app.set('view engine', 'html'); 
app.use(middlewares.logs('dev'));
app.use(middlewares.Ajax());
app.use(middlewares.Ajax_Update());


var conn=mongoose.createConnection('localhost', 'Archivo', 27017);//my collection 

conn.once('open',function(){
console.log("conexion abierta")//conecction open ar archivo collection 

var gfs = Grid(conn.db, mongoose.mongo);
/*
var escritura=gfs.createWriteStream({
	_id:new mongoID(),
	filename:'bruno-Mars',
	mode:"w",
	chunkSize:1024,
	content_type:"video/mp4",
	root:"fs",
	metadata:{
		"data":"data extra"
	}
});

fs.createReadStream('../file/bruno.mp4').pipe(escritura);
 
escritura.on("close",function(file){
	console.log(file);
});
WORK GOOD
*/



var readStream=gfs.createReadStream({
	_id:"53cbfcac709687fc16d7401b",
 range: {
    startPos:0,
		endPos:40233373
  }
});



	readStream.on('open',function(){
		console.log("start..");
	});//open


	readStream.on('data',function(chunk){
		console.log("loading...")
	});//loading

	readStream.on("end",function(){
	  console.log("ready");
	});//end 

  readStream.on('error', function (err){
   console.log(err);   
  });



	app.get("/",function(req,res){

		gfs.createReadStream({
			_id:"53cbfcac709687fc16d7401b",//id of my video in mongodb 
		 	range: {
		    startPos:0,
				endPos:40233373
		  }
		}).pipe(res);

	});//get file video


/*
//try other way 

var data=0;
var readStream=gfs.createReadStream({
	_id:"53cbfcac709687fc16d7401b",
 range: {
    startPos:0,
		endPos:40233373
  }
});



	readStream.on('open',function(){
		console.log("start..");
	});//open


	readStream.on('data',function(chunk){
		data+=chunk//caching chunk  
		console.log("loading...")
	});//loading

	readStream.on("end",function(){
	  console.log("ready");
	});//end 

  readStream.on('error', function (err){
   console.log(err);   
  });
 

  app.get("/",function(req,res){
		res.contentType("video/mp4");
		readStream.pipe(res);
		res.send(data);//send the data of the video 
		//dont work 	
  });	
*/
  	





});//end connection with Archivo collection 





server.listen(1010,function(){
	console.log("Escuchando en el puerto : 1010")//listen on port 1010
});












