var express=require("express");
var fileuploader=require("express-fileupload");
var mysql2=require("mysql2");
var cloudinary=require("cloudinary").v2;
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
var app=express();
app.listen(2006,function(){
    console.log("Server Started 2006");
})
const sendEmail = require('./mailer');


app.get('/SendMail', (req, res) => {
    const email = req.query.Email;

    sendEmail(email);

    res.json({ success: true, message: 'Email sent successfully!' });
});




cloudinary.config({ 
    cloud_name: 'du8k2e7ba', 
    api_key: '645354452213814', 
    api_secret: '_5m-ZLa-H_saFBguKIRfYPqUhmE'
});
app.use(express.static("public"));
app.use(fileuploader());
app.use(express.urlencoded(true));

app.get("/",function(req,resp){
    var path=__dirname+"/public/index.html";
    resp.sendFile(path);
})
app.get("/OrganiserProfile",function(req,resp){
    var path=__dirname+"/public/OrganiserProfile.html";
    resp.sendFile(path);
})
app.get("/tournaments-finder",function(req,resp){
    var path=__dirname+"/public/tournaments-finder.html";
    resp.sendFile(path);
})
app.get("/Publish-Tournaments",function(req,resp){
    var path=__dirname+"/public/publish-tournaments.html";
    resp.sendFile(path);
}) 
let configuration="mysql://avnadmin:AVNS_H7yvqKdsOeVzBxWeTPn@mysql-2eb3597b-goyaldevansh828-19a6.k.aivencloud.com:28158/Sports"
let mysqlServer=mysql2.createConnection(configuration);
mysqlServer.connect(function(err)
{
    if(err==null)
        console.log("Connected to aiven Database Server Successfully");
    else
        console.log(err.message);
})
app.get("/SignUp",function(req,resp){
    mysqlServer.query("insert into users values(?,?,?,current_date(),?)",[req.query.txtEmail,req.query.txtPwd,req.query.utype,1],function(err)
    {
        if(err==null){
            resp.send("you are sign up");
        }
        else{
            resp.send(err.message);
        }
    })
});
app.get("/Check-user-SignUp",function(req,resp){
    let email=req.query.txtEmail;
    mysqlServer.query("select * from users where email=?",[email],function(err,jsonArray)
    {
        //resp.send(jsonArray)
        if(jsonArray.length==1)
            resp.send("Already Exist");
        else
            resp.send("Ok");
    })
});

app.get("/login",function(req,resp){
    let email=req.query.LoginEmail;
    let pwd=req.query.LoginPwd;
    mysqlServer.query("select * from users where email=? and pwd=?",[email,pwd],function(err,jsonArray)
    {
        console.log(jsonArray)
        if(jsonArray.length==1)
        {
            resp.send(jsonArray[0]["utype"]);
            console.log(jsonArray[0]["status"]);
        }
        else
            resp.send("incorrect credentials");
    })
});
app.post("/save",async function(req,resp){
    let email=req.body.emailid;
    let organisation=req.body.organisation;
    let contact=req.body.contact;
    let address=req.body.address;
    let city=req.body.city;
    let proof=req.body.proof;

    let sports=req.body.sports.toString();
    let hosted=req.body.hosted;
    let web=req.body.web;
    let filename="";
    if(req.files==null)
        {
            filename="nopic.jpg";
        }
        else
        {
            filename=req.files.doc.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.doc.mv(path);
           await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
                console.log(filename);
            });
        }
    mysqlServer.query("insert into organisations values(?,?,?,?,?,?,?,?,?,?)",[email,organisation,contact,address,city,proof,filename,sports,hosted,web],function(err)
    {
        if(err==null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    })
});
app.post("/update",async function(req,resp){
    let email=req.body.emailid;
    let organisation=req.body.organisation;
    let contact=req.body.contact;
    let address=req.body.address;
    let city=req.body.city;
    let proof=req.body.proof;

    let sports=req.body.sports.toString();
    let hosted=req.body.hosted;
    let web=req.body.web;
    let filename="";
    
    filename=req.files.doc.name;
    let path=__dirname+"/public/uploads/"+filename;
    console.log(path);
    req.files.doc.mv(path);
    await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
    });
        
    mysqlServer.query("update organisations set organisation=?,contact=?,address=?,city=?,proof=?,ppic=?,sports=?,hosted=?,web=? where email=?",[organisation,contact,address,city,proof,filename,sports,hosted,web,email],function(err)
    {
        if(err==null)
            resp.send("Record Updated Successfully");
        else
            resp.send(err.message);
    })
});
app.post("/upload-tournaments",async function(req,resp){
    let tournaments=req.body.tournaments;
    let emailid=req.body.emailid;
    let game=req.body.game;
    let title=req.body.title;
    let fee=req.body.entryfee;
    let dot=req.body.date;
    let city=req.body.city;
    let location=req.body.location;
    let prizes=req.body.prizes;
    let filename="";
    
    filename=req.files.poster.name;
    let path=__dirname+"/public/uploads/"+filename;
    console.log(path);
    req.files.poster.mv(path);
    await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
    });
    let info=req.body.info;
    mysqlServer.query("insert into tournaments values(?,?,?,?,?,?,?,?,?,?,?,?)",[null,tournaments,emailid,game,title,fee,dot,city,location,prizes,filename,info],function(err)
    {
        if(err==null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    })
});
app.get("/fetch-all-records",function(req,resp){
    let city=req.query.city;
    let game=req.query.game;
    mysqlServer.query("select * from tournaments where city=? and game=?",[city,game],function(err,jsonArray)
    {
        if(err==null)
            resp.send(jsonArray);
        else
            resp.send(err.message)
    })
});
app.get("/fetch-cities",function(req,resp){
    mysqlServer.query("select city from tournaments",function(err,jsonArray)
    {
        if(err==null)
            resp.send(jsonArray);
        else
            resp.send(err.message)
    })
});
app.get("/fetch-games",function(req,resp){
    mysqlServer.query("select game from tournaments",function(err,jsonArray)
    {
        if(err==null)
            resp.send(jsonArray);
        else
            resp.send(err.message)
    })
});
app.get("/FetchDetails",function(req,resp){
    let email=req.query.email;
    mysqlServer.query("select * from organisations where email=?",[email],function(err,jsonArray)
    {
        if(err==null)
            resp.send(jsonArray);
        else
            resp.send(err.message)
    })
});
app.get("/update-Pwd",function(req,resp){
    let email=req.query.email;
    let CurrPwd=req.query.CurrPwd;
    let NewPwd=req.query.NewPwd;
    mysqlServer.query("update users set pwd=? where email=? and pwd=?",[NewPwd,email,CurrPwd],function(err,result){
        if(err!=null){
            resp.send(err.message);
        }
        else if(result.affectedRows==1){
            resp.send("Updated successfully")
        }
        else{
            resp.send("invalid Current Password")
        }
    });
});
app.get("/checkUser",function(req,resp){
    let LoginEmail=req.query.LoginEmail;
    let LoginPwd=req.query.LoginPwd;
    mysqlServer.query("select * from users where email=? and pwd=?",[LoginEmail,LoginPwd],function(err,jsonArray)
    {
        if(jsonArray.length==1)
        {
            resp.send(jsonArray[0]["utype"]);
        }
        else
        {
            resp.send(err.message);
        }
    });
});
app.get("/FetchPlayerDetails",function(req,resp){
    let email=req.query.email;
    mysqlServer.query("select * from Players where email=?",[email],function(err,jsonArray)
    {
        if(err==null)
            resp.send(jsonArray);
        else
            resp.send(err.message)
    })
});
app.post("/savePlayer",async function(req,resp){
    let email=req.body.emailid;
    let name=req.body.name;
    let games=req.query.games;
    let mobile=req.body.mobile;
    let dob=req.query.dob;
    let gender=req.query.gender;
    let address=req.body.address;
    let city=req.body.city;
    let proof=req.body.proof;
    let filename="";
    let otherinfo=req.query.otherinfo;
    if(req.files==null)
        {
            filename="nopic.jpg";
        }
        else
        {
            filename=req.files.doc.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.doc.mv(path);
           await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
                console.log(filename);
            });
        }
    mysqlServer.query("insert into Players values(?,?,?,?,?,?,?,?,?,?,?)",[email,name,games,mobile,dob,gender,address,city,proof,filename,otherinfo],function(err)
    {
        if(err==null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    })
});
app.post("/updatePlayer",async function(req,resp){
    let email=req.body.emailid;
    let name=req.body.name;
    let games=req.query.games;
    let mobile=req.body.mobile;
    let dob=req.query.dob;
    let gender=req.query.gender;
    let address=req.body.address;
    let city=req.body.city;
    let proof=req.body.proof;
    let filename="";
    let otherinfo=req.query.otherinfo;
    
    filename=req.files.doc.name;
    let path=__dirname+"/public/uploads/"+filename;
    console.log(path);
    req.files.doc.mv(path);
    await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
    });
        
    mysqlServer.query("update Players set name=?,games=?,mobile=?,dob=?,gender=?,address=?,city=?,proof=?,filename=?,otherinfo=? where email=?",[name,games,mobile,dob,gender,address,city,proof,filename,otherinfo,email],function(err)
    {
        if(err==null)
            resp.send("Record Updated Successfully");
        else
            resp.send(err.message);
    })
});