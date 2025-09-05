//this js file here is where we will get the info from the client side , that is, 
// fetching the requests

// this here we will fetch the puzzle prop from this href 
// it gives us different puzzles each time

//the first .then() is used to handle the un-parsed response
//the second .then() is the one when response is received and parsed to json and now can be accessed

const dynamicWeather = (address, errorMsg , responseMsg,description) => {
    const weatherUrl = `/weather?address=${address}`;


fetch(weatherUrl)
.then((response)=>{
    response.json()
    .then((data)=>{
        if(data.error) errorMsg.textContent = data.error;
        else{
            // console.log(data)
            errorMsg.textContent = data.temperature;
            responseMsg.textContent = data.location;
            description.textContent = data.description;
            // console.log(data);
            // console.log("Temperature: "+ data.temperature);
            // console.log("Address: "+ data.location);
        }
        
        
        // console.log("Temperature: "+ data.current.temperature);
        // console.log("Address: "+ data.location.name);
    })
    // .catch((error)=>{//error when the passed address is the issue
    //     console.log(error);
        
    // })
})
// .catch((error)=>{//error when net connection is the issue
//     console.log(error);
// })
}

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageEr = document.querySelector('#error_msg')
const messageWth = document.querySelector('#weather_msg')
const description = document.querySelector('#desc_msg')

// messageEr.textContent = 'From Js'

weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()//it prevents the default behavior of refreshing the page on from submission 

    messageEr.textContent = "Loading..."
    messageWth.textContent = ''
    description.textContent = ''
    dynamicWeather(search.value,messageEr,messageWth,description);//logging the value received
})