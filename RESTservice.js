var exp=require('express');
var fs=require('fs');
var bodyparser=require('body-parser');
var app=exp();
var urlencodedparser  = bodyparser.urlencoded({extended:true});
app.get('/RESTservice.htm',function(r,s){
	s.sendFile(__dirname+'/RESTservice.htm');
	});
app.get('/get_emp',function(r,s){
		s.header({"Content-type":"json/text"});
	console.log(r.query);
	fs.readFile(__dirname+'/DBObj.txt',function(err,data){
		var d = JSON.parse(data);
		var emppresent=false;
		d.Employee.forEach(function(item){
			if(item.Id===r.query.id)
			{
				emppresent=true;
				s.end(JSON.stringify(item));
			}
		});
		if(!emppresent)
			s.end("Employee not found");

		});
	});

app.post('/update_emp',urlencodedparser,function(r,s){
	fs.readFile(__dirname+'/DBObj.txt',function(err,data){
		var d= JSON.parse(data);
		d.Employee.forEach(function(item){
			console.log(r.body.id);
			if(item.Id===r.body.id)
			{
				item.Name=r.body.name;
				item.Dept=r.body.dept;
			}
			});
			console.log(JSON.stringify(d));
			fs.writeFile(__dirname+'/DBObj.txt',JSON.stringify(d),function(err,stat){
				s.end("Updated");
				});

		});


	});

app.post('/add_emp',urlencodedparser,function(r,s){
	fs.readFile(__dirname+'/DBObj.txt',function(err,data){
		var d= JSON.parse(data);
		var emppresent=false
		d.Employee.forEach(function(item){
			console.log(r.body.id);
			if(item.Id===r.body.id)
			{
				emppresent=true;
				s.end("Employee with that Id already present");
			}
			});
			if(!emppresent)
			{
			d.Employee.push({"Id":r.body.id,
			"Name":r.body.name,
			"Dept":r.body.dept
			});
			console.log(JSON.stringify(d));
			fs.writeFile(__dirname+'/DBObj.txt',JSON.stringify(d),function(err,stat){
			s.end("Added");
			});
			}


		});


	});



const server = app.listen(process.env.PORT||"8080",function(){
	const port = server.address().port;
	console.log("Emp App listening on "+port);
	});

//app.post();

//app.put();t
