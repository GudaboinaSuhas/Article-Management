const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise= require('bluebird');

mongoose.connect('mongodb://localhost/nodekb');
let db=mongoose.connection; 

// check for connection
db.once('open',function(){
    console.log('Connected to MongoDB');
});     

// check for db error
db.on('error',function(err){
    console.log(err);
});


const app = express();

//Bring in models
let Article = require('./models/article'); 

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Middle ware for body parser (required)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
    
    Article.find({},function(err,articles){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title:'Articles',
                articles : articles
            });
        }        
    }); 
    //res.send('Hello World');
    //res.render('index');
    
    /*let articles=[    // static array
        {
            id:1,
            title:'Article 1',
            author:'Suhas'
        },
        {
            id:2,
            title:'Article 2',
            author:'Sukanya'
        }
    ];*/  
    /*res.render('index',{
        title:'Articles',
        articles : articles
    });*/

});

app.get('/articles/add',function(req,res){
    res.render('add_article',{
        title:'Articles'
    });
});

app.post('/articles/add',function(req,res){

    let article = new Article();
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;
    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
            res.redirect('/');
        }
    });
});


app.listen(3000,function(){
    console.log('Example app listening on port 3000');
});