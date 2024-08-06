import { Todo } from "@/types/Entry";

interface TodoItemProps {
  entry: Todo;
  deleteItem: (item: Todo) => void;
  markAsDone: (item: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ entry, deleteItem, markAsDone }) => {
  return (
    <tr>
      <td className={`p-2 ${entry.status === "done" ? "line-through" : ""}`}>{entry.what_to_do}</td>
      <td className="p-2">{entry.due_date}</td>
      <td className="p-2">
        <button onClick={() => markAsDone(entry)} className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white">
          Mark as done
        </button>
        <button onClick={() => deleteItem(entry)} className="rounded bg-red-500 px-2 py-1 text-white">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TodoItem;
