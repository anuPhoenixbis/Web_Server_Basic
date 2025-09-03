const express = require('express');
const path = require('node:path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');


//PATH MODULE

// console.log(__dirname)//returns the path to the dir of the current file
// console.log(__filename)//returns the path to the current file

//Using the path module to access the paths easily
// console.log(path.basename('D:\VS_Code_WorkSpaces\Web_Dev\Backend_Learn\Node\Web_server\public\index.html','.html')) //it returns the path but the path elements aren't separated by any kind of delim 
// //They are continuous
// console.log(process.env.PATH);
// // Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

// console.log(process.env.PATH.split(path.delimiter))
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']

/*
D:\VS_Code_WorkSpaces\Web_Dev\Backend_Learn\Node\Web_server\src
D:\VS_Code_WorkSpaces\Web_Dev\Backend_Learn\Node\Web_server\src\app.js
Using these we can point to the public dir to fetch the required files and folder and render them using express
*/

// console.log(path.join(__dirname,'../public'))//joining the current dir along with moving to the public folder
//its like we are at the dir folder in the terminal and trying to "cd" to the given folder name in the 2nd arg 

const publicDirname = path.join(__dirname,'../public')//holds the public folder path

const app = express();


//Don't take much tension about handlebars using React is much simpler and will easily resolve the 
// dynamic issue

//to setup handlebars 
//keep the views folder inside the src dir so it can detect it in this setup
//to explicitly say when its outside the src folder we need to do:
app.set("views", path.join(__dirname, "templates/views")); // this holds complete view html and partials will hold partials
hbs.registerPartials(path.join(__dirname,'templates/partials'))//this contains partial html code and not full values


app.set('view engine','hbs')//to perform some kinds of settings to the express and node 
//here we are setting up handlebars
//keeping the views/index.hbs as the home page instead of index.html

app.get('',(req,res)=>{
    //to render the index.hbs we will use
    res.render('index',{
        title: "Weather",
        body: "Content",
        footer: "Home Footer"
    })//to make it dynamic we can pass in the values which can then be used inside the passed file
})

//rending the about page using handlebars
app.get('/about',(req,res)=>{
    res.render('about',{
        title: "About",
        body: "This is the content of about page",
        footer: "About Footer"
    })
})
//similarly for the help route
app.get('/help',(req,res)=>{
    // res.send("This is the help page")
    res.render('help',{
        title: "Help",
        body: "Help body",
        code: 404,
        message : "Page not found",
        footer: "help footer"
    })
})

/*
app.use is for middleware (general-purpose functions that preprocess requests, serve static files, logging,
authentication, etc.), while app.get/post/... is for actual route handling.
*/

//global middleware
// app.use((req,res,next)=>{
//     console.log(req.method, req.url); //logs every req
//     next();//moves to the next middleware  or route 
// })

//serving static files: html,css and js 
app.use(express.static(publicDirname)); //now the files in the folder 'public' are being served

//specific route middleware
// app.use('api',(req,res,next)=>{
//     console.log("API route accessed");
//     next();
// })

// app.get('api/user',(req,res)=>{
//     res.send("User Api")
// })

//.get() => Takes some query args in req at the provided url and returns that info 
// app.get('',(req,res)=>{ //the empty url represents as home
//     //req -> it requests some specified values from the url
//     //res -> returns the response based on the args in the url to the web server
//     res.send("Hello") 
// });
//the above home route is not required as the html file is rendered as the home route by app.use

//Query strings: This is the info that is passed with the req in the url itself
//we can access it to perform various types of actions
app.get('/products',(req,res)=>{
    //to make it mandatory to have a "search" while passing the url
    if(!req.query.search) {
        return res.send({
            error: "Search term must be there"//only if we would have done res.send 
            //it would have worked but would throw an error saying no query should have 
            // more than 1 response with return we are sending just one response once the case passes and 
            //terminating the query then and there
        })
    }

    // console.log(req.query.rating)//logs the query value passed
    // console.log(req.query)//this log will appear in the terminal and not in the browser console
    //this log returns the queries passed along in the url
    res.send({
        products: req.query.search
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Address is missing"
        });
    }

    const address = req.query.address;

    geocode.getWeather(address, (error, data={}) => {//we were trying to destructure a obj previously but now it will all
        //be undefined for all the obj props when the error is thrown, now no crashes will occur
        if (error) {
            return res.send({ error });
        }
        res.send({
            address: address,
            location: data.location,
            temperature: data.temperature,
            description: data.weatherDescription,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            observationTime: data.observationTime,
            feelsLike: data.feelsLike
        });
    });
});



app.get('/html',(req,res)=>{//pass the html code directly inside the string
    res.send("<h1>This page shows how we can pass html code</h1><br/><p>This is a paragraph</p>")
})
//instead of pass html code directly here we can pass entire dirs of frontend files
//the public folder serves as the home for those kinds of files, especially html  

app.get('/json',(req,res)=>{
    res.send({//pass the json body directly to it
        "obj1":"we just need to pass the json obj",
        "obj2":"express will detect it and render a json body there"
    })
})

app.get('/help/{*splat}',(req,res)=>{//on finding any help endpoint this message pops up
    res.status(404).render('notfound',{
        stop_code:404,
        stop_message:"Help endpoint not found"
    })
})

/* 
When get() tries to render a undefined endpoint it shows a cannot get this endpoint page
Instead, we will try to render a better 404 page
*/
//this route needs to be last as its the 404 page handler
app.get('/{*splat}',(req,res)=>{ //the "/{*splat}" will catch all the endpoints including root
    // res.status(404).send("My 404")//here on hitting 404 on any route shows this text response
    res.status(404).render('notFound',{
        stop_code: 404,
        stop_message: "Page not found"
    })
})


app.listen(3001 , () => {
    console.log("The server is running") //the message is displayed server is running on the provided port
}); //to start the server