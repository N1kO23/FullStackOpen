const mongoose = require('mongoose')

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PROTO = process.env.DB_PROTO || 'mongodb+srv' // Defaulting to atlas based proto

if (!DB_USERNAME) {
  console.error('database username not defined')
  process.exit(1)
}
if (!DB_PASSWORD) {
  console.error('database password not defined')
  process.exit(1)
}
if (!DB_HOST) {
  console.error('database host not defined')
  process.exit(1)
}

const url = `${DB_PROTO}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: {
    type: String,
    required: true,
    // minlength: 9, // Sisältää väliviivan
    validate: {
      validator: function (phoneNumber) {
        // Tarkistetaan väliviivan olemassaolo
        if (!phoneNumber.includes('-')) {
          throw new Error(
            'phone number must be in format xx-xxxxx...x or xxx-xxxxx...x'
          )
        }
        // Tarkistetaan että molemmat osat sisältävät vain numeroita
        const parts = phoneNumber.split('-')
        if (!/^\d+$/.test(parts[0]) || !/^\d+$/.test(parts[1])) {
          throw new Error('phone number may only contain numbers')
        }
        // Tarkistetaan kokonaispituus
        if (phoneNumber.length < 8) {
          throw new Error('phone number must be at least 8 characters long')
        }
        // Tarkistetaan etuliite
        const prefix = phoneNumber.split('-')[0]
        if (!/^\d{2,3}$/.test(prefix)) {
          throw new Error('phone number prefix can only be 2 to 3 numbers')
        }
        // Kaikki validoinnit onnistuneet
        return true
      },
      message: (props) => props.reason.message,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
