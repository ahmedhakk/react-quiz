import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const {
    answer,
    index,
    numQuestions,
    status,
    nextQuestion,
    getFinished,
    getRestart,
  } = useQuiz();

  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => nextQuestion()}>
        Next
      </button>
    );

  if (index === numQuestions - 1)
    // 14
    return (
      <button className="btn btn-ui" onClick={() => getFinished()}>
        Finish
      </button>
    );

  if (status === "finished")
    return (
      <button className="btn btn-ui" onClick={() => getRestart()}>
        Restart Quiz
      </button>
    );
}

export default NextButton;
