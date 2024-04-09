import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticsLine = ({ text, value, suffix }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value}
        {suffix}
      </td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total || 0;
  const positive = (good / total) * 100 || 0;

  const allZero = good === 0 && neutral === 0 && bad === 0;

  if (allZero) {
    return <div>No feedback given</div>;
  }

  return (
    <table>
      {good > 0 && <StatisticsLine text="good" value={good} />}
      {neutral > 0 && <StatisticsLine text="neutral" value={neutral} />}
      {bad > 0 && <StatisticsLine text="bad" value={bad} />}
      {total > 0 && <StatisticsLine text="all" value={total} />}
      {average > 0 && <StatisticsLine text="average" value={average} />}
      {positive > 0 && (
        <StatisticsLine text="positive" value={positive} suffix={"%"} />
      )}
    </table>
  );
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGoodByOne = () => setGood(good + 1);
  const increaseNeutralByOne = () => setNeutral(neutral + 1);
  const increaseBadByOne = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={increaseGoodByOne} text={"good"} />
        <Button handleClick={increaseNeutralByOne} text={"neutral"} />
        <Button handleClick={increaseBadByOne} text={"bad"} />
      </div>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
