const express = require('express');
const path = require('node:path');

const app = express();
const public = path.join(__dirname,'../public')



app.use(express.static(public))




app.listen(3002,()=>{
    console.log("This app is serving at port 3002")
})