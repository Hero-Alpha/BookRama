const mongoose = require("mongoose");
const initData = require("./data.js").data;
const Listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/BookRama");
};

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData);
    console.log("Data was initialized");
}

initDB();