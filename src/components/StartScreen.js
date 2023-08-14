import { useQuiz } from "../contexts/QuizContext";

function StartScreen() {
  const { getStart, numQuestions } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome To React Quiz!</h2>
      <h3>{numQuestions} questions to test you React mastary</h3>
      <button className="btn btn-ui" onClick={() => getStart()}>
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
