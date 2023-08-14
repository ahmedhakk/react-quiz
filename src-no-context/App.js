import { useEffect, useReducer } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading", // loading , error, ready, active, finished
  index: 0, // index of the current question
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const reducer = (state, action) => {
  if (action.type === "dataReceived")
    return {
      ...state,
      questions: action.payload,
      status: "ready",
    };

  if (action.type === "dataFailed")
    return {
      ...state,
      status: "error",
    };

  if (action.type === "start")
    return {
      ...state,
      status: "active",
      secondsRemaining: state.questions.length * SECS_PER_QUESTION,
    };

  if (action.type === "newAnswer") {
    const question = state.questions.at(state.index);

    return {
      ...state,
      answer: action.payload, // payload = index of answer option
      points:
        action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
    };
  }

  if (action.type === "nextQuestion")
    return {
      ...state,
      index: state.index + 1,
      answer: null,
    };

  if (action.type === "finish")
    return {
      ...state,
      status: "finished",
      highscore:
        state.points > state.highscore ? state.points : state.highscore,
    };

  if (action.type === "restart")
    return {
      ...initialState,
      status: "ready",
      questions: state.questions,
    };

  if (action.type === "tick")
    return {
      ...state,
      secondsRemaining: state.secondsRemaining - 1,
      status: state.secondsRemaining === 0 ? "finished" : state.status,
    };

  return initialState;
};

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curQuestion) => acc + curQuestion.points,
    0
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();

        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        console.log(err);
        dispatch({ type: "dataFailed" });
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <>
            <FinishScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highscore={highscore}
            />
            <NextButton dispatch={dispatch} status={status} />
          </>
        )}
      </Main>
    </div>
  );
}
