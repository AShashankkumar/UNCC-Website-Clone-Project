const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    rsvp: {
        type: String,
        required: [true, "is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "is required"]
    },
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connection',
        required: [true, "is required"]
    }
})

const model = mongoose.model('Rsvp', rsvpSchema);

module.exports = {
    rsvp: model
}
