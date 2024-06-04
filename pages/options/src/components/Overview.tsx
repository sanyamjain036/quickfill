import {
  questionStorage,
  useStorageSuspense,
} from "@chrome-extension-boilerplate/shared";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";

type Question = {
  question: string;
  answer: string;
  id: string;
};

const QuestionCard = ({ question }: { question: Question }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [questionValue, setQuestionValue] = useState(question.question);
  const [answerValue, setAnswerValue] = useState(question.answer);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerValue(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionValue(e.target.value);
  };

  const handleBlur = async () => {
    await questionStorage.addOrUpdateQuestions({
      id: question.id,
      question: questionValue,
      answer: answerValue,
    });
  };

  return (
    <div className="pl-1 pr-4 space-y-2">
      <div className="flex justify-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.9}
          stroke="currentColor"
          className="size-4 cursor-pointer"
          onClick={() => {
            questionStorage.removeQuestion(question.id);
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Field"
        value={questionValue}
        ref={inputRef}
        onBlur={handleBlur}
        onChange={handleInputChange}
        className="flex h-9 w-full font-light rounded-md border-bbBlackWhite border-[1px] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
      />
      <textarea
        ref={textareaRef}
        value={answerValue}
        onBlur={handleBlur}
        onChange={handleTextareaChange}
        placeholder="Answer"
        className="flex min-h-20 w-full font-light rounded-md border-bbBlackWhite border-[1px] bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

const Overview = () => {
  const questions = useStorageSuspense(questionStorage) as Question[];
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddQuestion = async () => {
    const newQues = {
      id: nanoid(),
      question: "",
      answer: "",
    };
    await questionStorage.addOrUpdateQuestions(newQues);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-6 cursor-pointer hover:scale-110"
          onClick={handleAddQuestion}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <div
        className="space-y-6 pb-8 h-[calc(100vh-150px)] scrollbar-thin scrollbar-webkit overflow-y-scroll scroll-smooth"
        ref={containerRef}
      >
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center font-medium text-lg underline mt-10">
            No fields added
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
