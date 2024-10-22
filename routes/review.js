const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const router = express.Router({mergeParams: true});

// ---------------------------------------------------------------------

// Review validation handler
const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next(); 
    }
}

// ---------------------------------------------------------------------

// REVIEW MANAGEMENT

//POST REVIEW ROUTE("/listings/:id/reviews"): to post reviews
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// DELETE REVIEW ROUTE("/listings/:id/reviews/:rediew._id") 
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;