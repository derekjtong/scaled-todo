import React from "react";

interface TodoItemProps {
  entry: TodoItemType;
  deleteItem: (item: TodoItemType) => void;
  markAsDone: (item: TodoItemType) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  entry,
  deleteItem,
  markAsDone,
}) => {
  return (
    <tr>
      <td className={`p-2 ${entry.status === "done" ? "line-through" : ""}`}>
        {entry.what_to_do}
      </td>
      <td className="p-2">{entry.due_date}</td>
      <td className="p-2">
        <button
          onClick={() => markAsDone(entry)}
          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
        >
          Mark as done
        </button>
        <button
          onClick={() => deleteItem(entry)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TodoItem;
