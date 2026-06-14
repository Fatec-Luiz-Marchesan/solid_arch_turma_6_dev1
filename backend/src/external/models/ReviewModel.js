const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const ReviewModel = mongoose.model(
    'Review',
    new Schema(
        {
            rating: {
            type: Number,
            required: true,
            min: [1, 'A nota deve estar entre 1 e 5!'],
            max: [5, 'A nota deve estar entre 1 e 5!'],
        },
        comment: {
            type: String,
            required: true,
        },
        petId: {
        type: String,
        required: true,
        },  
        authorId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
    )
)
module.exports = ReviewModel