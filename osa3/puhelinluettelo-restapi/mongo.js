const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (process.argv.length > 3 && (!name || !number)) {
  console.log(
    'give both name and number as extra arguments for addition, leave empty for listing'
  )
  process.exit(1)
}

// Palvelin sijaitsee samassa lähiverkossa, joten yhdistetään paikallisverkossa määritetyllä domain namella
const url = `mongodb://fullstackopen:${password}@db.nullpointr.me/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
})

const Person = mongoose.model('Person', personSchema)

// Jos lisäparametrit, niin lisätään uusi entry
if (process.argv.length > 3) {
  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  // Muutoin tulostetaan
  Person.find({}).then((result) => {
    console.log('phonebook:')

    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
