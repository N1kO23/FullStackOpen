import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length));
  const [selected, setSelected] = useState(0);
  const [mostVotedIndex, setMostVotedIndex] = useState(0);

  const handleNextAnecdoteClick = () => {
    const indeksi = Math.floor(Math.random() * anecdotes.length);
    setSelected(indeksi);
  };

  const handleVote = () => {
    const copy = [...points];
    copy[selected] += 1;

    let currentlyHighestIndex = 0;
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] > copy[currentlyHighestIndex]) currentlyHighestIndex = i;
    }
    setMostVotedIndex(currentlyHighestIndex);
    setPoints(copy);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>
        <div>{anecdotes[selected]}</div>
        <span>has {points[selected]} votes</span>
        <br />
        <button onClick={handleVote}>vote</button>
        <button onClick={handleNextAnecdoteClick}>next anecdote</button>
      </div>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[mostVotedIndex]}</div>
    </div>
  );
};

export default App;
