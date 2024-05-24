import {
  questionStorage,
  useStorageSuspense,
} from "@chrome-extension-boilerplate/shared";
import { useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

type Question = {
  question: string;
  answer: string;
  id: string;
};

const Card = ({ question }: { question: Question }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  return (
    <div
      className={`${question.question === "" ? "text-slate-500" : ""} p-3 cursor-pointer border border-gray-100 min-h-9 w-full font-light rounded-md bg-transparent px-3 py-1 text-sm shadow-sm`}
      onClick={() => {}}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {question.question || "Empty Field"}
    </div>
  );
};

const Order = () => {
  const questions = useStorageSuspense(questionStorage) as Question[];
  const containerRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      questionStorage.set((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-28 px-10">
        <div ref={containerRef} className="border-bbBlackWhite border-[1px] p-6">
          <SortableContext
            items={questions}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <Card key={question.id} question={question} />
                ))
              ) : (
                <div className="text-center font-medium text-lg underline">
                  No fields added
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

export default Order;
