import { useQuiz } from "../contexts/QuizContext";

function Options({ question }) {
  const { answer, newAnswer } = useQuiz();
  const hasAnswer = answer !== null;

  return (
    <div className="options">
      {/* options.map((option, index)=>{}) => That is how this map function works */}
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} 
          ${
            hasAnswer
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAnswer}
          onClick={() => newAnswer(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
