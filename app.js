const express=require("express");
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const Campground=require("./models/Campground");
const methodOverride=require("method-override")
const  cities = require("./seeds/cities");
const ejsMate=require("ejs-mate");
const ExpressErrors=require('./utils/ExpressErros')

const wrapper=require('./utils/wrapperasync');
const Review = require("./models/review");
const { findById } = require("./models/review");
const { Console } = require("console");
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    
    useUnifiedTopology:true
});
app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Datebase connected");
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.listen('3000',()=>{
    console.log("listening");
}
)
// app.get('/',(req,res)=>{
//     const suma="i love u"; 
//      res.render('home',{suma})
// })

app.get('/campgrounds',wrapper(async(req,res)=>{
   const campgrounds= await  Campground.find({});
     res.render('campgrounds/index',{campgrounds});
}))
app.get('/campgrounds/create',wrapper(async(req,res)=>{
     res.render('campgrounds/create');
   
}))
app.post('/campgrounds',wrapper(async (req,res)=>{
    const newcampground=new Campground(req.body.campground);
    await newcampground.save();
    res.redirect(`campgrounds/${newcampground._id}`);
}))
app.get('/campgrounds/:id',wrapper(async(req,res,next)=>{
 
    const camp=await Campground.findById(req.params.id);

    
   
    res.render('campgrounds/show',{camp});
    
 
}))
app.get('/campgrounds/:id/edit',wrapper(async(req,res)=>{
    const camp =await Campground.findById(req.params.id);
    //res.send(camp._id);
    res.render('campgrounds/edit',{camp});
}))

app.put('/campgrounds/:id',wrapper(async (req,res,next)=>{
  //  const camp =await Campground.findById(req.params.id);

    const {id}=req.params;
 
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
     res.redirect(`/campgrounds/${campground._id}`);


}))
app.delete('/campgrounds/:id',wrapper(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

}))
app.post('/campground/:id/reviews',wrapper(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
   
    const review=new Review(req.body.review);
    console.log(req.body.review);
     campground.reviews.push(review);
    await review.save();
     await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}))
app.get('/campground/:id/showreviews',wrapper(async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const finalreview=[];
     for(let cam of camp.reviews){
        const obj=await Review.findById(cam);
       finalreview.push(obj);
     }
   
  
 //   const reviews=await findById(camp.reviews[0]);
 res.render('campgrounds/reviews',{finalreview});
  
}))


app.use((err,req,res,next)=>{
     const {statusCode=500,message='something  went wrong'}=err;
    // res.send("oh no something went wrong")
  res.status(statusCode).render('error',{err});
 
})

app.use('*',(err,req,res,next)=>{
    next(new ExpressErrors('page not found',404));
//   res.send("hai i am here")
 })
// app.get('/makecam,wrapper(async(req,res)=>{
//     const camp=new Campground({title:'yard',description:"cheap"});
//     await camp.save();
//     res.send(camp);
// })