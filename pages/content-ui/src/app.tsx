import {
  questionStorage,
  useStorageSuspense,
} from "@chrome-extension-boilerplate/shared";

type Question = {
  question: string;
  answer: string;
  id: string;
};

const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const handleClick = (answer: string) => {
    window.dispatchEvent(
      new CustomEvent("clickedQuestion", { detail: answer })
    );
  };
  return (
    <div
      className="p-3 cursor-pointer border border-gray-100 min-h-9 w-full font-light rounded-md bg-transparent px-3 py-1 text-sm shadow-sm hover:bg-bbWhite hover:text-bbBlackWhite"
      onClick={() => handleClick(answer)}
    >
      {question}
    </div>
  );
};
const App = () => {
  const questions = useStorageSuspense(questionStorage) as Question[];

  return (
    <div
      id="poppy-popup"
      className="absolute hidden p-4 bg-[#09090B] text-bbWhite"
    >
      {questions.length > 0 ? (
        <div className="h-[300px] w-[500px] overflow-y-scroll space-y-3">
          {questions.map((q) => (
            <Question key={q.id} answer={q.answer} question={q.question} />
          ))}
        </div>
      ) : (
        <div className="text-center">No fields found!</div>
      )}
    </div>
  );
};

export default App;
