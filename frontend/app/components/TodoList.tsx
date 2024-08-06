"use client";
import { Spinner } from "@/components/Spinner";
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
    setItems(items.map((i) => (i.id === item.id ? { ...i, status: "done" } : i)));
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="mb-4 text-2xl font-bold">Oh, so many things to do...</h3>
      {isLoading ? (
        <div className="flex justify-center">
          <div className="my-10 mr-2 h-4 w-4 animate-spin">
            <Spinner />
          </div>
        </div>
      ) : (
        <table className="mb-4 w-full table-auto">
          <tbody>
            {items.length > 0 ? (
              items.map((entry) => <TodoItem key={entry.id} entry={entry} deleteItem={deleteItem} markAsDone={markAsDone} />)
            ) : (
              <tr>
                <td className="p-4 text-center italic">Unbelievable. Nothing to do for now.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <button onClick={toggleForm} id="toggle_button" className="mb-4 rounded bg-blue-500 px-4 py-2 text-white">
        {showForm ? "Cancel the new entry" : "Add a new item"}
      </button>
      {showForm && (
        <form onSubmit={addItem} className="mb-4">
          <div className="mb-4 flex flex-wrap">
            <div className="w-full p-2 sm:w-1/2">
              <label className="mb-1 block">What to do:</label>
              <input
                type="text"
                size={50}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
            <div className="w-full p-2 sm:w-1/4">
              <label className="mb-1 block">When:</label>
              <input type="text" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded border p-2" />
            </div>
            <div className="w-full p-2 sm:w-1/4">
              <label className="invisible mb-1 block">Submit:</label>
              <input type="submit" value="Save the new item" className="w-full rounded bg-green-500 px-4 py-2 text-white" />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TodoList;
