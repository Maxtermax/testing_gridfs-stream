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
var ID=new mongoID();
var escritura=gfs.createWriteStream({
	_id:ID,
	filename:'esneyder',
	mode:"w",
	chunkSize:1024*4,
	content_type:"image/gif",
	root:"fs",
	metadata:{
		"data":"Soy batman",
		"ID":ID+".formato"
	}
});

fs.createReadStream('./file/batman.gif').pipe(escritura);
escritura.on("close",function(file){
	console.log(file);
});
*/



/*
var id='53cdb016d536cc3018c949e4';

gfs.exist({_id:id}, function (err, found) {
  if (err) return handleError(err);
  found ? console.log('File exists') : console.log('File does not exist');
});//Comprueba la existencia del archivo 

gfs.remove({_id:id}, function (err) {
  if (err) return handleError(err);
  console.log('success');

});//remueve el archivo
*/

/*
gfs.files.find({ filename:'esneyder'}).toArray(function (err, files) {
    if (err) console.log(err);
    console.log(files[0].metadata);
});
*/



function SendFile(res,u,id){
//QUERY FILE
gfs.files.find({filename:u}).toArray(function(err,docs){
	var len=docs.length
	if(err) console.log(err);
	if(docs[0] === undefined ) res.send(404);//user not found

	for(var i=0;i<len;i++){
		if(docs[i]["metadata"]["ID"] == id){
			var readStream=gfs.createReadStream({
				_id:id.slice(0,24)
			}).on('open',function(){
				console.log("start..");
			}).on('data',function(chunk){
				//loading...
				console.log("loading");
			}).on("end",function(){
				console.log("ready");
				//loaded :)
			}).on('error', function (err){
				res.send(404);//no found  file :(
				console.log(err);
			});
			readStream.pipe(res.type(docs[i]["contentType"]));
			console.log(docs[i]["metadata"]);
			break	
		}else if(i === len-1){
			res.send(404);//file not found
		}


	}


});


};//termina funcion 

app.get("/:u/:video",function(req,res){
	var user=req.params.u;
	var file=req.params.video;
 SendFile(res,user,file);	

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












