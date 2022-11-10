const express=require("express");
const app=express();
const cities=require('./cities');
const mongoose=require('mongoose');
const path=require("path");
const {descriptors,places}=require('./seedHelpers');
const Campground=require("../models/Campground");
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    
    useUnifiedTopology:true
});
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Datebase connected");
})
// app.set('view engine','ejs');

// app.set('views',path.join(__dirname,'views'));
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seeddb=async()=>{
    await Campground.deleteMany({});
  for(let i=0;i<50;i++){
    const random=Math.floor(Math.random()*1000);
    const random1=500*(Math.floor(Math.random()*500));
   
   const huge=  new Campground({
    description:"Sweat in peace So you don't bleed in war",
    image:'http://source.unsplash.com/collection/483251', 
    location:`${cities[random].city} ${cities[random].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,
    price:random1,
  
  
});
     await huge.save();
  }
   
}
seeddb().then(()=>{
    console.log("Disconnect it after the work");
   mongoose.connection.close();
})