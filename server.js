const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT||3000;//default para=3000
//process.env is an object which stores all the key value pairs
var app = express();

hbs.registerPartials(__dirname+'/view/partials');
//used to let us use partials which are used to make a partial part of a website, there are also partial functions that can also be used as functions to create output dynamically
//middleware lets us customize express and tweaks it, app.use adds the middleware
app.set('view engine', 'hbs');
//key value pair in app.set tells which view engine will be used 
app.set('views', __dirname + '/view')

//app.use is the way to register middleware
app.use((req,res,next) => {
    //we can do anything here,if we use something asynchronous middleware will not continue until we run next();
    //req contains all the info about the request made by user like http method, query, parameter, go to express website to know more
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log+'\n',(err)=> {
        if(err) {
            console.log('Unable to append server.log');
        }
    });
    //req method is get or post and req url is the url of webpage
    next();
    //we have to call next when we do something asynchronous like reading from a database but there are situations when we dont wanna call next
});

//app.use((req,res,next) => {
//    res.render('maintenance.hbs');}
//);
//uncomment this to make everything below it stop working
app.use(express.static(__dirname+'/public'));
//now everything below it cant be seen because of no next call except help.html but it is now shifted below it so we cant access it this is used to keep our data private
hbs.registerHelper('getCurrentYear',() =>{
   return new Date().getFullYear(); 
});

hbs.registerHelper('screenIT',(text) => {
    return text.toUpperCase();
})

app.get('/', (req, res) => {
//    res.send('<h1>Hello Express</h1>');
//    res.send({
//       name:'Nikhil',
//        likes:  [
//            'biking',
//            'cities'
//        ]
//    });
    res.render('home.hbs',{
       pageTitle: 'Home page',
        welcome:'Welcome Home'
    });
});

app.get('/projects',(req,res)=>{
    res.sender('projects.hbs',{
        pageTitle:'Projects'
    });
});

app.get('/about',(req,res) => {
    res.render('about.hbs',{
        pageTitle:'About Page',
    });
});

app.get('/bad',(req,res) => {
    res.send({
        errorMessage : 'There is an error, unable to handle request'
    });
});


app.listen(port,() => {
    console.log(`Server is up on ${port}. View now.`);
});
//app.listen has a second argument which is a fn called when server is up 

//req=request stores info about request coming in, the path, the body, the method called
//res=response stores how to respond to the request what to send back etc .
//res.send is the response to user request he will receive it in body
//app is not going to listen without app.listen it binds the applicatio to a port on our machine, we will use port 3000 a common port to develop locally
//the apps having app.listen never stop manually, we have to terminate them, we have to tell it to stop