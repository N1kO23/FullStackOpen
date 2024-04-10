const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

const Header = (props) => {
  return <h2>{props.course}</h2>;
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const total = parts.reduce(
    (previousCount, currentPart) => previousCount + currentPart.exercises,
    0
  );

  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  );
};

export default Course;
