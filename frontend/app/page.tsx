"use client";
import { TODO_API_URL } from "@/lib/config";
import axios from "axios";
import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";

export default function Home() {
  const [initialItems, setInitialItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTodoItems() {
    const res = await axios.get(`${TODO_API_URL}/api/items`);
    setIsLoading(false);
    return res.data;
  }

  useEffect(() => {
    async function loadData() {
      const items = await fetchTodoItems();
      setInitialItems(items);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <TodoList initialItems={initialItems} isLoading={isLoading} />
    </main>
  );
}
