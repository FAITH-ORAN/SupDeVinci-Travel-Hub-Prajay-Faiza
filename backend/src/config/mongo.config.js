const mongoose = require('mongoose')

const connectMongo = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://berrichif0717:U7M4nNF6JUoi0Kq9@cluster0.rfcqlso.mongodb.net/travel?retryWrites=true&w=majority'
    )
    console.log('✅ Connected to MongoDB Atlas')
  } catch (err) {
    console.error('❌ MongoDB error:', err.message)
  }
}

module.exports = connectMongo
