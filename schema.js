const Joi = require('joi');

// Listing validation schema
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Title is required.',
        }),
        author: Joi.string().required().messages({
            'string.empty': 'Author is required.',
        }),
        genre: Joi.string().required().messages({
            'string.empty': 'Genre is required.',
        }),
        image: Joi.object({
            url: Joi.string().uri().allow('', null).optional().messages({
                'string.uri': 'Image URL must be valid if provided.',
            })
        }).optional()
    }).required()
});

// Review validation schema
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required().messages({
            'number.min': 'Rating must be at least 1.',
            'number.max': 'Rating cannot be more than 5.',
        }),
        comment: Joi.string().required().messages({
            'string.empty': 'Comment is required.',
        })
    }).required()
});

module.exports = { listingSchema, reviewSchema };
