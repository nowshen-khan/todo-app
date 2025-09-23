"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { Todo } from "@/utils/types";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import CompletedTodoItem from "@/components/CompletedTodoItem";
import ActiveTodoItem from "@/components/ActiveTodoItem";

/** Importance helpers for completed tasks */
const importanceLabel: Record<Todo["importance"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
const importanceBadge: Record<Todo["importance"], string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};

export default function Home() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [importance, setImportance] = useState<Todo["importance"]>("medium");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Normalize backend data */
  const normalize = (raw: any): Todo => ({
    id: raw._id?.toString() ?? raw.id?.toString(),
    text: raw.text ?? "",
    completed: !!raw.completed,
    category: raw.category ?? "General",
    importance: raw.importance ?? "medium",
    pinned: !!raw.pinned,
    createdAt: raw.createdAt ?? raw.created_at,
  });

  /** Fetch todos */
  useEffect(() => {
    setLoading(true);
    fetch("/api/todos")
      .then((r) => r.json())
      .then((data) => setTodos(data.map(normalize)))
      .catch(() => setErrorMessage("Failed to load todos"))
      .finally(() => setLoading(false));
  }, []);

  /** Derived lists */
  const activeTodos = useMemo(
    () =>
      todos.filter((t) => !t.completed).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.importance] - order[b.importance];
      }),
    [todos]
  );

  const completedTodos = useMemo(() => todos.filter((t) => t.completed), [todos]);

  /** Actions: Add / Delete / Toggle / Pin / Importance / Edit */
  const addTask = async () => {
    if (!task.trim()) return;
    const payload = { text: task.trim(), category, importance, pinned: false };
    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const raw = await res.json();
      setTodos((s) => [...s, normalize(raw)]);
      setTask(""); setCategory("General"); setImportance("medium");
    } catch {
      setErrorMessage("Could not add task");
    } finally { setLoading(false); }
  };

  const deleteTask = async (id: string) => {
    setTodos((s) => s.filter((t) => t.id !== id));
    try { await fetch(`/api/todos/${id}`, { method: "DELETE" }); } catch { setErrorMessage("Delete failed"); }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    try { await fetch(`/api/todos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: !completed }) }); } catch { setErrorMessage("Toggle failed"); }
  };

  const togglePin = async (id: string) => {
    const pinned = !todos.find((t) => t.id === id)?.pinned;
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, pinned } : t)));
    try { await fetch(`/api/todos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pinned }) }); } catch { setErrorMessage("Pin failed"); }
  };

  const changeImportance = async (id: string, next: Todo["importance"]) => {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, importance: next } : t)));
    try { await fetch(`/api/todos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ importance: next }) }); } catch { setErrorMessage("Importance failed"); }
  };

  const startEdit = (t: Todo) => { setEditingId(t.id); setEditingText(t.text); };
  const cancelEdit = () => { setEditingId(null); setEditingText(""); };
  const saveEdit = async (id: string) => {
    if (!editingText.trim()) return setErrorMessage("Task cannot be empty");
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, text: editingText } : t)));
    cancelEdit();
    try { await fetch(`/api/todos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: editingText.trim() }) }); } catch { setErrorMessage("Edit failed"); }
  };

  /** Drag & Drop */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newActive = Array.from(activeTodos);
    const [moved] = newActive.splice(result.source.index, 1);
    newActive.splice(result.destination.index, 0, moved);
    const newTodosList = [...newActive, ...todos.filter((t) => t.completed)];
    setTodos(newTodosList);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen transition-colors duration-300`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-slate-100 flex flex-col items-center p-6">
        {/* Header */}
        <header className="w-full max-w-3xl flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400">Professional Todo</h1>
          <button onClick={() => setDarkMode((s) => !s)} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:shadow-md">{darkMode ? "Light" : "Dark"}</button>
        </header>

        {/* Add Task */}
        <AddTodo
          task={task} setTask={setTask}
          category={category} setCategory={setCategory}
          importance={importance} setImportance={setImportance}
          addTask={addTask}
        />

        {/* Error */}
        {errorMessage && <div className="max-w-3xl w-full mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/40 text-red-800 dark:text-red-200 p-3 rounded">{errorMessage}</div>}

        {/* Active Todos */}
        <main className="w-full max-w-3xl">
          <h2 className="text-lg font-semibold mb-2">Active</h2>
          <TodoList
            todos={activeTodos}
            editingId={editingId}
            editingText={editingText}
            setEditingText={setEditingText}
            startEdit={startEdit}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            togglePin={togglePin}
            changeImportance={changeImportance}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            onDragEnd={onDragEnd}
          />

          {/* Completed */}
          <h2 className="text-lg font-semibold mb-2">Completed</h2>
          <ul className="space-y-3">
            {completedTodos.map((t) => (
             <CompletedTodoItem
      key={t.id}
      todo={t}
      toggleComplete={toggleComplete}
      deleteTask={deleteTask}
    />
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
