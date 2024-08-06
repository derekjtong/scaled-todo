"use client";
import { useAuthContext } from "@/components/providers/auth-provider";
import TodoList from "./components/TodoList";

export default function Home() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-semibold">Scaled Todo</h2>
        <p className="mb-4">Welcome</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <TodoList />
    </main>
  );
}
