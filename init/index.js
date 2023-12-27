const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = 'mongodb://127.0.0.1:27017/wanderlusts';

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data =  initdata.data.map((obj) =>({...obj , owner :"6583f596332b35b08e6680ce"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialize");

}

initDB();