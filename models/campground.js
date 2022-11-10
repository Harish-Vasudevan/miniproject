const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const campgroundschema=new Schema({
    title:String,
    price:String,
    image:String,
    description:String,
    location:String,
    price:Number,
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:'reviews'
        }
    ]
});
Campground=mongoose.model('Campground',campgroundschema);
module.exports=Campground