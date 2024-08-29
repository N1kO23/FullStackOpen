import { useState, useEffect } from 'react'
import personService from '../services/persons'

const Filter = ({ searchQuery, handleSearchQueryChange }) => {
  return (
    <div>
      filter shown with <input value={searchQuery} onChange={handleSearchQueryChange} />
    </div>
  )
}

const PersonForm = ({ addNumber, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addNumber}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, handleOnDelete }) => {
  return (
    <>
      {persons.map((person) => {
        return (
          <div key={person.id}>
            {person.name} {person.number} <button onClick={() => handleOnDelete(person.id)}>Delete</button>
          </div>
        )
      })}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleOnDelete = (id) => {
    if (window.confirm("Do you really want to delete this person?")) {
      personService.deletePerson(id).then(response => {
        if (response.status === 200) {
          personService.getAllPersons().then(response => {
            setPersons(response.data);
          })
        } else {
          console.log(response)
        }
      })
    }
  }

  useEffect(() => {
    personService.getAllPersons().then(response => {
      setPersons(response.data);
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const addNumber = async (event) => {
    event.preventDefault();

    const foundPerson = persons.filter(person => person.name === newName)[0];
    if (foundPerson) {
      if (window.confirm(`The person ${newName} is already in phonebook. Do you want to update their phone number?`)) {
        const personToAdd = { name: newName, number: newNumber };
        await personService.updatePerson(foundPerson.id, personToAdd);
        setNewName('');
        setNewNumber('');
      }
    } else {
      const personToAdd = { name: newName, number: newNumber };
      await personService.createPerson(personToAdd);
      setNewName('');
      setNewNumber('');
    }
    personService.getAllPersons().then(response => {
      setPersons(response.data);
    })
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} handleSearchQueryChange={handleSearchQueryChange} />
      <h2>Add a new</h2>
      <PersonForm addNumber={addNumber} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleOnDelete={handleOnDelete} />
    </div>
  )
}

export default App