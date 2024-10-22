const Joi = require('joi');
const listing = require('./models/listing');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        genre: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow('', null).optional()  // Allow empty or null URL
        }).optional()
    }).required()
});

// --------------------------------------------------------------------
// Validation schema for the reviews

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});

module.exports = { listingSchema, reviewSchema };
