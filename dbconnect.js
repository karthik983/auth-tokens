const mongoose=require("mongoose");

const dbcon=async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/sampler",{ useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex:true})
        console.log(`Connected to MongoDB`)
    }
    catch(err){
        throw err;
    }
}


module.exports=dbcon
