
function DBProductInfo(reqObj, res) {
	
  var retObj;
  var productdata = {
      productcode: reqObj.productcode,
	  name: reqObj.name,
	  price: reqObj.price,
	  quantity: reqObj.quantity,
	  category: reqObj.category,
	  image: reqObj.image
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
	   //DB ��� ���� ������ 
	   connection.query('select * from productinfo', function(err, rows) {
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
	   //DB ������ ã�� (AND)
	   var sql = 'select * from productinfo where ';
	   
	   if (productdata.productcode != undefined) {
		   sql += ('productcode = "' + productdata.productcode + '"'); 
	   }
	   if (productdata.name != undefined) {
		   sql += (' AND name = "' + productdata.password + '"');  
	   }
	   if (productdata.price != undefined) {
		   sql += (' AND price = "' + productdata.price + '"'); 
	   }
	   if (productdata.quantity != undefined) {
		   sql += (' AND quantity = "' + productdata.quantity + '"');  
	   }
	   if (productdata.category != undefined) {
		   sql += (' AND category = "' + productdata.category + '"'); 
	   }
	   if (productdata.image != undefined) {
		   sql += (' AND image = "' + productdata.image + '"');  
	   }
	   
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
	   //DB ������ ã�� (OR)
	   var sql = 'select * from productinfo where ';
	   
	   if (productdata.productcode != undefined) {
		   sql += ('productcode = "' + productdata.productcode + '"'); 
	   }
	   if (productdata.name != undefined) {
		   sql += ('OR name = "' + productdata.name + '"');  
	   }
	   if (productdata.price != undefined) {
		   sql += ('OR price = "' + productdata.price + '"'); 
	   }
	   if (productdata.quantity != undefined) {
		   sql += ('OR quantity = "' + productdata.quantity + '"');  
	   }
	   if (productdata.category != undefined) {
		   sql += ('OR category = "' + productdata.category + '"'); 
	   }
	   if (productdata.image != undefined) {
		   sql += ('OR image = "' + productdata.image + '"');  
	   }
	  
	   var login = [productdata.productcode, productdata.password];
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
	   //DB ������ �Է�
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
                        throw err;
                    });
                }// if err
				else {
					res.write(JSON.stringify(productdata));
					res.end();
				}
				
            });// commit
			
			
        });// insert into log
		
   }
   
   else if (acttype == 5){
	   //DB ������ ����
	   //key ���� ������� �Ͽ� �ٸ� ��� ���� �����Ѵ�.
	   //productinfo key �� productcode
	   
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
	   if (productdata.image != undefined) {
		   sql += (', image = "' + productdata.image + '"');  
	   }
	   
	   sql += (' where productcode = "' + productdata.productcode + '"');
	   
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
					res.write(JSON.stringify(productdata));
					res.end();
				}
            });// commit
        });// update into log
		retObj = true;
	   
   }
   else if (acttype == 6){
	   //DB ������ ����
	   //productcode ���� Ȯ���Ͽ� ����
	   var productcode = productdata.productcode;
	   
	   connection.query('delete from productinfo where productcode = ?', productcode, function(err, result) {
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
					res.write(JSON.stringify(productdata));
					res.end();
				}
            });// commit
        });// delete into log
		retObj = true;
	   
   }
   else {
	   retObj = false;
	   // ����ó��
   }
  
  return retObj;
}