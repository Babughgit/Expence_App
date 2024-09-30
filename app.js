const express=require('express');
const bodyparser=require('body-parser');
const mysql=require('mysql2');
const path=require('path');
const app=express();
const PORT=4000;
app.listen(PORT,function()
{
    console.log("server started");
})
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

const db=mysql.createPool(
    {
        host:'127.0.0.1',
        user:'root',
        password:'Babusql@2024',
        database:'Expense_App'
    }
);

db.getConnection(function(err,connect)
{
    if(err)
    {
        console.log(`error${err}`);
    }
    else{
        console.log("connection successfull");
    }
})

app.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','SignUp.html'));
})

app.post('/SignUp',(req,res)=>
{
    const{name,email,password}=req.body;
    const checkEmail='SELECT email FROM users WHERE email=?';
    db.query(checkEmail,[email],(err,result)=>
    {
        if (err) {
        console.log("error checking email",err);
        return res.status(500).send('server error');
        }
        if(result.length>0)
        {
           return res.status(403).send("email already exist");
        }
         const insertquery='INSERT INTO users(name,email,password) VALUES(?,?,?)';
         db.query(insertquery,[name,email,password],(err,result)=>
        {
            if(err)
            {
                console.log("error inserting user",err);
                return res.status(500).send('server error');
            }
            res.send('signup successful');
        })
    })
    
})