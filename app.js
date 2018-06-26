var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var dbconfig = require('./db_config/db_config.js');

connection = mysql.createConnection(dbconfig);

connection.connect();

 app.listen(8080, function() {
    	console.log("start@ on port 8080");
    });

 app.use(express.static(__dirname));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}));
 app.set('view engine', 'ejs');
 
 //app.use ('/main', main);

   
 function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


    app.get('/', function(req,res){
    	res.sendFile(__dirname + "/index.html");
    });
	
	app.get('/main', function(req,res){
		 //DB 모든 유저 데이터 
		var max;
	   connection.query('select * from productinfo', function(err, rows) {
		   if(err) {
				throw err;
		   }
		   else {
			   /*var string = JSON.stringify(rows);
			   res.write(rows);*/
			   
			   if (rows.length > 8 ) {max = 8;}
			   else {max = rows.length;}
			   
			   var data="<div class = 'pic3'><ul>"  
			   for (var i = 0; i < max; i++) {
					data += "<li>";
					data += rows[i].name;
					data += "</li>";
			    }
				data += "</ul></div>";  

		   }
	   });
    	res.sendFile(__dirname + "/index.html");
    });
	
	app.get('/main_user', function(req,res){
    	res.sendFile(__dirname + "/index_user.html");
    });
	
	app.get('/main_admin', function(req,res){
    	res.sendFile(__dirname + "/index_admin.html");
    });
	
	app.get('/user', function(req,res){
    	res.sendFile(__dirname + "/user.html");
    });
	
	app.get('/message', function(req,res){
    	res.sendFile(__dirname + "/message.html");
    });
	
	app.get('/areg', function(req,res){
    	res.sendFile(__dirname + "/admin_reg.html");
    });
	
	app.get('/admin', function(req,res){
    	res.sendFile(__dirname + "/admin.html");
    });
	
	app.get('/amanage', function(req,res){
    	res.sendFile(__dirname + "/admin_manage.ejs");
    });
	
	app.get('/asold', function(req,res){
    	res.sendFile(__dirname + "/admin_soldout.html");
    });
	
	app.get('/qnamain', function(req,res){
		res.sendFile(__dirname + "/QnA.html");
    });
	
	
	app.post('/login', function(req,res){
		var userdata = {
			id: req.body.id,
			password: req.body.password,
		};
		
		var sql = 'select * from UserInfo where ';
	   
	   if (userdata.id != undefined) {
		   sql += ('id = "' + userdata.id + '"'); 
	   }
	   if (userdata.password != undefined) {
		   sql += (' AND password = "' + userdata.password + '"');  
	   }
	
	   connection.query(sql, function(err, rows) {
		   if(err) {
			   throw err;
		   }
		   else {
				var string = JSON.stringify(rows[0]);
				console.log(string);
				if(rows.length == 0) {
					res.send('<script type="text/javascript">alert("login is failed."); location.href = "/user"; </script>');
				}
				else {
					if (rows[0].rating > 1) {
						res.send('<script type="text/javascript">alert("login is success."); location.href = "/main_admin"; </script>');
						
					}
					else {
						res.send('<script type="text/javascript">alert("login is success."); location.href = "/main_user"; </script>');
					}
					
					
				}
		
		   }
	   });
	   
	  
		
    });
	
	
	app.post('/registration', function(req,res){
		var userdata = {
			id: req.body.id,
			password: req.body.password,
			status: 1,
			name: req.body.name,
			number: req.body.number,
			address: req.body.address,
			email: req.body.email,
			rating: 1
		};
		
		
		
		connection.query('insert into userinfo set ?', userdata, function(err, result) {
		   if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            console.log('insert transaction log');
 
            connection.commit(function (err) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
						location.href = "/main";
                        throw err;
						
                    });
					
                }// if err
				
            });// commit	
			
        });// insert into log*/
		res.send('<script type="text/javascript">alert("registration is success."); location.href = "/main"; </script>');
		
    });
	
	
	app.post('/newproduct', function(req,res){
		var pcode = makeid();
		
		
		var productdata = {
			productcode: pcode,
			name: req.body.pname,
			price: req.body.price,
			quantity: 0,
			category: req.body.category,
			contents: req.body.contents
		};
		
		
		connection.query('insert into productinfo set ?', productdata, function(err, result) {
		   if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            console.log('insert transaction log');
 
            connection.commit(function (err) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
						location.href = "/main";
                        throw err;
						
                    });
					
                }// if err
				else {
				
				}
				
            });// commit
			
			
        });// insert into log*/
		res.send('<script type="text/javascript">alert("registration is success."); location.href = "/admin"; </script>');
		
    });
	
	
	
	app.post('/updateproduct', function(req,res){
		var pcode = req.body.pcode;
		
		
		var productdata = {
			name: req.body.pname,
			price: req.body.price,
			quantity: req.body.quantity,
			category: req.body.category,
			contents: req.body.contents
		};
		
		var sql = 'update productinfo set ';
	   
	   if (productdata.name != undefined) {
		   sql += ('name = "' + productdata.name + '"');  
	   }
	   if (productdata.price != undefined) {
		   sql += (', price = "' + productdata.price + '"'); 
	   }
	   if (productdata.quantity != undefined) {
		   sql += (', quantity = "' + productdata.quantity + '"');  
	   }
	   if (productdata.category != undefined) {
		   sql += (', category = "' + productdata.category + '"'); 
	   }
	   if (productdata.contents != undefined) {
		   sql += (', contents = "' + productdata.contents + '"');  
	   }

	   
	   sql += (' where productcode = "' + pcode + '"');
	   console.log(sql);
	   
		connection.query(sql, function(err, result) {
		   if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            console.log('update transaction log');
 
            connection.commit(function (err) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
						location.href = "/main";
                        throw err;
						
                    });
					
                }// if err
				else {
				
				}
				
            });// commit
			
			
        });// insert into log*/
		res.send('<script type="text/javascript">alert("update is success."); location.href = "/admin"; </script>');
		
    });
	
	app.post('/deleteproduct', function(req,res){
		var pcode = req.body.pcode;
		
		console.log(pcode);
		connection.query('delete from productinfo where productcode = ?', pcode, function(err, result) {
		   if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            console.log('delete transaction log');
 
            connection.commit(function (err) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }// if err
				else {
		
				}
            });// commit
        });// delete into log
		res.send('<script type="text/javascript">alert("delete is success."); location.href = "/admin"; </script>');
		
    });
	
	app.post('/newqna', function(req,res){
		var day = new Date();
		var qnacode = makeid();
		
		var qnadata = {
			qnacode: qnacode,
			clientid: req.body.name,
			category: req.body.category,
			contents: req.body.contents,
			createdate: day
		};
		
		
		connection.query('insert into qnadata set ?', qnadata, function(err, result) {
		   if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            console.log('insert transaction log');
 
            connection.commit(function (err) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
						location.href = "/main";
                        throw err;
						
                    });
					
                }// if err
				else {
				
				}
				
            });// commit
			
			
        });// insert into log*/
		res.send('<script type="text/javascript">alert("qna registration is success."); location.href = "/qnamain"; </script>');
		
    });
	
	app.post('/newanswer', function(req,res){
		var day = new Date();
		var qnacode = makeid();
		
		var qnadata = {
			qnacode: qnacode,
			clientid: req.body.name,
			category: req.body.category,
			contents: req.body.contents,
			createdate: day
		};
		
		
		connection.query('insert into qnadata set ?', qnadata, function(err, result) {
		   if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }// if err
            console.log('insert transaction log');
 
            connection.commit(function (err) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
						location.href = "/main";
                        throw err;
						
                    });
					
                }// if err
				else {
				
				}
				
            });// commit
			
			
        });// insert into log*/
		res.send('<script type="text/javascript">alert("qna registration is success."); location.href = "/qnamain"; </script>');
		
    });
	
	
	