"use client";
import { TODO_API_URL } from "@/lib/config";
import axios from "axios";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

interface TodoItemType {
  id: number;
  what_to_do: string;
  due_date: string;
  status: string;
}

interface TodoListProps {
  initialItems: TodoItemType[];
  isLoading: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ initialItems, isLoading }) => {
  const [items, setItems] = useState<TodoItemType[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const toggleForm = () => setShowForm(!showForm);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post(`${TODO_API_URL}/api/items`, {
      what_to_do: newTodo,
      due_date: dueDate,
    });
    setItems([...items, response.data]);
    setNewTodo("");
    setDueDate("");
    toggleForm();
  };

  const deleteItem = async (item: TodoItemType) => {
    await axios.delete(`${TODO_API_URL}/api/items/${item.id}`);
    setItems(items.filter((i) => i.id !== item.id));
  };

  const markAsDone = async (item: TodoItemType) => {
    await axios.put(`${TODO_API_URL}/api/items/${item.id}`);
    setItems(
      items.map((i) => (i.id === item.id ? { ...i, status: "done" } : i))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">Oh, so many things to do...</h3>
      {isLoading ? (
        <div className="mb-4">Loading...</div>
      ) : (
        <table className="table-auto w-full mb-4">
          <tbody>
            {items.length > 0 ? (
              items.map((entry) => (
                <TodoItem
                  key={entry.id}
                  entry={entry}
                  deleteItem={deleteItem}
                  markAsDone={markAsDone}
                />
              ))
            ) : (
              <tr>
                <td className="p-4 text-center italic">
                  Unbelievable. Nothing to do for now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <button
        onClick={toggleForm}
        id="toggle_button"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel the new entry" : "Add a new item"}
      </button>
      {showForm && (
        <form onSubmit={addItem} className="mb-4">
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 p-2">
              <label className="block mb-1">What to do:</label>
              <input
                type="text"
                size={50}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="w-full sm:w-1/4 p-2">
              <label className="block mb-1">When:</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="w-full sm:w-1/4 p-2">
              <label className="block mb-1 invisible">Submit:</label>
              <input
                type="submit"
                value="Save the new item"
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TodoList;
