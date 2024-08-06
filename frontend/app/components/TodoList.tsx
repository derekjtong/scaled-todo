"use client";
import { addTodo, deleteTodo, getTodos, markDoneTodo } from "@/api/entries";
import { useAuthContext } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/Spinner";
import { Todo, TodosResponse } from "@/types/Entry";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const { authToken } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const toggleForm = () => setShowForm(!showForm);

  useEffect(() => {
    setIsLoading(true);
    const fetchTodos = async () => {
      await getTodos(authToken || "")
        .then((response: AxiosResponse<TodosResponse>) => {
          console.log("todos", response.data);
          setItems(response.data.todos);
        })
        .catch((err) => {
          setError("Error fetching todos: " + err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchTodos();
  }, [authToken]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();

    const todo: Todo = {
      what_to_do: newTodo,
      due_date: dueDate,
    };
    try {
      const response = await addTodo(authToken || "", todo);
      console.log("adding todo", response.data.todo);
      setItems([...items, response.data.todo]);
      console.log("added to arr");

      setNewTodo("");
      setDueDate("");
      toggleForm();
    } catch (err: any) {
      setError("Error adding todo: " + err.message);
    }
  };

  const deleteItem = async (item: Todo) => {
    try {
      const response = await deleteTodo(authToken || "", item);
    } catch (err: any) {
      setError("Error adding todo: " + err.message);
    }
    setItems(items.filter((i) => i.eid !== item.eid));
  };

  const markAsDone = async (item: Todo) => {
    try {
      const response = await markDoneTodo(authToken || "", item);
    } catch (err: any) {
      setError("Error adding todo: " + err.message);
    }
    setItems(items.map((i) => (i.eid === item.eid ? { ...i, status: "done" } : i)));
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
            {items?.length > 0 ? (
              items.map((entry) => <TodoItem key={entry.eid} entry={entry} deleteItem={deleteItem} markAsDone={markAsDone} />)
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
