const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');
// Schema for the User Model in MongoDB.
const connectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'is Required']
    },
    topic: {
        type: String,
        required: [true, 'is Required']
    },
    details: {
        type: String,
        required: [true, 'is Required'],
        minLength:[10, 'atleast 10 characters']
    },
    date: {
        type: String,
        required: [true, 'is Required']
    },
    startTime: {
        type: String,
        required: [true, 'is Required']
    },
    endTime: {
        type: String,
        required: [true, 'is Required']
    },
    hostName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'is Required']
    },
    image: {
        type: String,
        required: [true, 'is Required']
    },
})

//create model
const model = mongoose.model('Connection', connectionSchema);

//export connectionSchema
module.exports = {
    model: model
}



