const mongoose = require('mongoose')

const legSchema = new mongoose.Schema(
  {
    flightNum: String,
    dep: String,
    arr: String,
    duration: Number,
  },
  { _id: false }
)

const offerSchema = new mongoose.Schema({
  from: String,
  to: String,
  departDate: Date,
  returnDate: Date,
  provider: String,
  price: Number,
  currency: String,
  legs: [legSchema],
  hotel: {
    name: String,
    nights: Number,
    price: Number,
  },
  activity: {
    title: String,
    price: Number,
  },
})

module.exports = mongoose.model('Offer', offerSchema)
