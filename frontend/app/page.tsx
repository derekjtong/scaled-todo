import { TODO_API_URL } from "@/lib/config";
import axios from "axios";
import TodoList from "./components/TodoList";

export default async function Home() {
  const res = await axios.get(`${TODO_API_URL}/api/items`);
  const initialItems = res.data;
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <TodoList initialItems={initialItems} />
    </main>
  );
}
