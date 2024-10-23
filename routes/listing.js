const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const router = express.Router();


// ---------------------------------------------------------------------
// Schema validation handler
// const validateListing = (req, res, next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     else{
//         next(); 
//     }
// }

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        // Log the exact error message
        console.log(error);
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// ---------------------------------------------------------------------
//INDEX ROUTE ("/listings")
// to show all the listings in the database

router.get("/", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    console.log( allListings );
    res.render("listings/index",{ allListings });
}));

// --------------------------------------------------------------------------
//CREATE ROUTE("/listings/new")
//to create and save new data on site

router.get("/new", (req, res) => {
    res.render("listings/newBook"); 
});


router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        await newListing.save();
        res.redirect("/listings");
    })
    
);


// --------------------------------------------------------------------------
//EDIT  - UPDATE ROUTE("listings/:id/edit")

router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let { id } = req.params;

    // console.log(req.body);

    let listingData = await Listing.findById(id);
    res.render("listings/editBook",{ listingData });
}));

router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    let { id } = req.params;

    console.log(req.body);

    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

// --------------------------------------------------------------------------
//DELETE ROUTE("/listings/:id")

router.post("/:id", wrapAsync(async(req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // return res.redirect("/listings");
}));


// --------------------------------------------------------------------------
//SHOW ROUTE ("/listings/:id")
//to navigate to a particular listing in the data

router.get("/:id", wrapAsync(async(req,res)=>{
    let { id } = req.params;
    console.log(id);
    let listingData = await Listing.findById(id).populate("reviews");
    res.render("listings/showBook.ejs",{ listingData });
}));

// --------------------------------------------------------------------------

module.exports =  router;