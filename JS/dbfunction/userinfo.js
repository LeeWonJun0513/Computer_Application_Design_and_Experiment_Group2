
function DBUserInfo(reqObj, res) {
	
  var retObj;
  var userdata = {
      id: reqObj.id,
	  password: reqObj.password,
	  status: reqObj.status,
	  name: reqObj.name,
	  number: reqObj.number,
	  address: reqObj.address,
	  email: reqObj.email,
	  rating: reqObj.rating
   };
   
  var acttype = reqObj.acttype;
  /*
	acttype
	1: select all
	2: search data (AND)
	3: search data (OR)
	4: insert data
	5: update data
	6: delete data
  */
  
   if (acttype == 1) {
	   //DB 모든 유저 데이터 
	   connection.query('select * from UserInfo', function(err, rows) {
		   if(err) {
				throw err;
		   }
		   else {
			   /*var string = JSON.stringify(rows);
			   res.write(rows);*/
			   
			   for (var i = 0; i < rows.length; i++) {
					var string = JSON.stringify(rows[i]);
					res.write(string);
			    }
				res.end();
		   }
	   });
   }
   else if (acttype == 2){
	   //DB 데이터 찾기 (AND)
	   var sql = 'select * from UserInfo where ';
	   
	   if (userdata.id != undefined) {
		   sql += ('id = "' + userdata.id + '"'); 
	   }
	   if (userdata.password != undefined) {
		   sql += (' AND password = "' + userdata.password + '"');  
	   }
	   if (userdata.status != undefined) {
		   sql += (' AND status = "' + userdata.status + '"'); 
	   }
	   if (userdata.name != undefined) {
		   sql += (' AND name = "' + userdata.name + '"');  
	   }
	   if (userdata.number != undefined) {
		   sql += (' AND number = "' + userdata.number + '"'); 
	   }
	   if (userdata.address != undefined) {
		   sql += (' AND address = "' + userdata.address + '"');  
	   }
	   if (userdata.email != undefined) {
		   sql += (' AND email = "' + userdata.email + '"');  
	   }
	   if (userdata.rating != undefined) {
		   sql += (' AND rating = "' + userdata.rating + '"');  
	   }
	   
	   var login = [userdata.id, userdata.password];
	   connection.query(sql, function(err, rows) {
		   if(err) {
			   throw err;
		   }
		   else {
			   for (var i = 0; i < rows.length; i++) {
					var string = JSON.stringify(rows[i]);
					res.write(string);
				}
				res.end();
		   }
	   });
	  
   }
   else if (acttype == 3){
	   //DB 데이터 찾기 (OR)
	   var sql = 'select * from UserInfo where ';
	   
	   if (userdata.id != undefined) {
		   sql += ('id = "' + userdata.id + '"'); 
	   }
	   if (userdata.password != undefined) {
		   sql += ('OR password = "' + userdata.password + '"');  
	   }
	   if (userdata.status != undefined) {
		   sql += ('OR status = "' + userdata.status + '"'); 
	   }
	   if (userdata.name != undefined) {
		   sql += ('OR name = "' + userdata.name + '"');  
	   }
	   if (userdata.number != undefined) {
		   sql += ('OR number = "' + userdata.number + '"'); 
	   }
	   if (userdata.address != undefined) {
		   sql += ('OR address = "' + userdata.address + '"');  
	   }
	   if (userdata.email != undefined) {
		   sql += ('OR email = "' + userdata.email + '"');  
	   }
	   if (userdata.rating != undefined) {
		   sql += ('OR rating = "' + userdata.rating + '"');  
	   }
	   
	   var login = [userdata.id, userdata.password];
	   connection.query(sql, function(err, rows) {
		   if(err) {
			   throw err;
		   }
		   else {
			   for (var i = 0; i < rows.length; i++) {
					var string = JSON.stringify(rows[i]);
					res.write(string);
				}
				res.end();
		   }
	   });
   }
   
   else if (acttype == 4){
	   //DB 데이터 입력
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
                        throw err;
                    });
                }// if err
				else {
					res.write(JSON.stringify(userdata));
					res.end();
				}
				
            });// commit
			
			
        });// insert into log
		
   }
   
   else if (acttype == 5){
	   //DB 데이터 수정
	   //key 값을 기반으로 하여 다른 모든 값을 수정한다.
	   //userinfo key 값 id
	   
	   var sql = 'update UserInfo set ';
	   
	   if (userdata.password != undefined) {
		   sql += ('password = "' + userdata.password + '"');  
	   }
	   if (userdata.status != undefined) {
		   sql += (', status = "' + userdata.status + '"'); 
	   }
	   if (userdata.name != undefined) {
		   sql += (', name = "' + userdata.name + '"');  
	   }
	   if (userdata.number != undefined) {
		   sql += (', number = "' + userdata.number + '"'); 
	   }
	   if (userdata.address != undefined) {
		   sql += (', address = "' + userdata.address + '"');  
	   }
	   if (userdata.email != undefined) {
		   sql += (', email = "' + userdata.email + '"');  
	   }
	   if (userdata.rating != undefined) {
		   sql += (', rating = "' + userdata.rating + '"');  
	   }
	   
	   sql += (' where id = "' + userdata.id + '"');
	   
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
                        throw err;
                    });
                }// if err
				else {
					res.write(JSON.stringify(userdata));
					res.end();
				}
            });// commit
        });// update into log
		retObj = true;
	   
   }
   else if (acttype == 6){
	   //DB 데이터 삭제
	   //id 값을 확인하여 삭제
	   var id = userdata.id;
	   
	   connection.query('delete from userinfo where id = ?', id, function(err, result) {
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
					res.write(JSON.stringify(userdata));
					res.end();
				}
            });// commit
        });// delete into log
		retObj = true;
	   
   }
   else {
	   retObj = false;
	   // 예외처리
   }
  
  return retObj;
}
