const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/user-auth-db`)


const postSchema = mongoose.Schema({
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" 
    }],
    // likes: Number,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model("post", postSchema)