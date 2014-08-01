var mongoose=require('mongoose');//mongoose driver 
var fs=require('fs');
var express=require('express')//express 4
var app=express();
var server=require('http').createServer(app)
var middlewares=require('./dependencies/express-middleware.js');
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
ESTE CODIGO CREA EL ESQUEMA DE ESCRITURA DE ARCHIVOS BINARIO COMO IMAGENES, VIDEOS ETC.. PARA INSERTARSE EN MONGODB
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

fs.createReadStream('./file/batman.gif').pipe(escritura);//CREA LA ESTRUCTURA JSON DE LAS CARACTERISTICAS DEL ARCHIVO

escritura.on("close",function(file){
   console.log(file);//ready se inserto el archivo
});
*/


function SendFile(res,u,id){
//QUERY FILE
 gfs.files.find({filename:u}).toArray(function(err,docs){
    var len=docs.length
    if(err) console.log(err);
    if(!docs[0]) res.send(404);//user not found
	
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
	     readStream.pipe(res.type(docs[i]["contentType"]));//responde el archivo segun el tipo de archivo que sea
	 	console.log(docs[i]["metadata"]);
			break	//si encontro el archivo solicitado se rompe el ciclo 
	     }else if(i === len-1){
		res.send(404);//file not found 
	     }
	}
	
 });//end gfs query


};//termina funcion 

app.get("file/:u/:video",function(req,res){
	var user=req.params.u;//user 
	var file=req.params.video;//id video
 SendFile(res,user,file);//call function handle file query	
});//get file video

server.listen(1010,function(){
   console.log("Escuchando en el puerto : 1010")//listen on port 1010
});
