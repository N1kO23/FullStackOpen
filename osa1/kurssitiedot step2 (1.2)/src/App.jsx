const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
};

const Content = (props) => {
  return (
    <>
      {props.parts.map((part, index) => (
        <p>
          {part} {props.exercises[index]}
        </p>
      ))}
    </>
  );
};

const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.count}</p>
    </>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content
        parts={[part1, part2, part3]}
        exercises={[exercises1, exercises2, exercises3]}
      />
      <Total count={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
