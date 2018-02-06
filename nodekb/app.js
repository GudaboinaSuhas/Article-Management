const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session'); 
const config = require('./config/database');
const passport = require('passport');

// mongoose.Promise= require('bluebird');

mongoose.connect(config.database);
// mongoose.connect('mongodb://localhost/nodekb');
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

app.use(express.static(path.join(__dirname,'public')));

// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

    while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg : msg,
        value : value
    };
    }
}));

// passport config
require('./config/passport')(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
    res.locals.user = req.user || null;
    next();
});

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

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);

app.listen(3000,function(){
    console.log('Example app listening on port 3000');
});