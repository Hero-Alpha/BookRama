const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const router = express.Router();


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
    res.render("listings/index.ejs",{ allListings });
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

router.delete('/:id', async (req, res) => { // Remove next parameter for now
    const { id } = req.params;
    console.log(`Attempting to delete listing with id: ${id}`);
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            console.log("Listing not found, redirecting...");
            return res.redirect('/listings'); // Redirect if listing not found
        }
        console.log("Listing deleted successfully, redirecting...");
        res.redirect('/listings'); // Redirect after successful deletion
    } catch (err) {
        console.error("Error occurred during deletion", err);
        res.redirect('/listings'); // Redirect on error
    }
});



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