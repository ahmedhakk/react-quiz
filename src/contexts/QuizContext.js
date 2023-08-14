import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const QuizContext = createContext({
  questions: [],
  status: String,
  index: Number,
  answer: String,
  points: Number,
  highscore: Number,
  secondsRemaining: Number,
  numQuestions: Number,
  maxPossiblePoints: Number,

  getStart() {},
  newAnswer(index) {},
  tick() {},
  nextQuestion() {},
  getFinished() {},
  getRestart() {},
});

const initialState = {
  questions: [],
  status: "loading", // loading , error, ready, active, finished
  index: 0, // index of the current question
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

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

const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curQuestion) => acc + curQuestion.points,
    0
  );

  const getStart = () => {
    dispatch({ type: "start" });
  };

  const newAnswer = (index) => {
    dispatch({ type: "newAnswer", payload: index });
  };

  const tick = useCallback(() => {
    dispatch({ type: "tick" });
  }, []);

  const nextQuestion = () => {
    dispatch({ type: "nextQuestion" });
  };

  const getFinished = () => {
    dispatch({ type: "finish" });
  };

  const getRestart = () => {
    dispatch({ type: "restart" });
  };

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
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,

        getStart,
        newAnswer,
        tick,
        nextQuestion,
        getFinished,
        getRestart,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext is used outside the QuizProvider");
  return context;
};

export { QuizProvider, useQuiz };
