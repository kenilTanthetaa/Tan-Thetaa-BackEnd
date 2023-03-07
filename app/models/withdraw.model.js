const mongoose = require('mongoose')
const Schema = mongoose.Schema

const withdrawRewards = new Schema({
    
    user_id: {
        type: String,
        required: true
    },
    rewards_withdrawn: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: 1
    }
    
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('WithdrawRewards', withdrawRewards)