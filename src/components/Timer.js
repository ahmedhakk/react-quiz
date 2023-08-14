import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

const Timer = () => {
  const { tick, secondsRemaining } = useQuiz();

  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(() => {
    // setInterval -> basiclly run the fun inside it every some ms
    const id = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
};

export default Timer;
