"use client";
import React from "react";
import { Todo } from "@/utils/types";

interface Props {
  task: string;
  setTask: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  importance: Todo["importance"];
  setImportance: (v: Todo["importance"]) => void;
  addTask: () => void;
}

const AddTodo = ({ task, setTask, category, setCategory, importance, setImportance, addTask }: Props) => (
  <section className="w-full max-w-3xl bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        className="flex-1 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <input
        className="w-36 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <select
        className="w-36 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent"
        value={importance}
        onChange={(e) => setImportance(e.target.value as Todo["importance"])}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button onClick={addTask} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Add</button>
    </div>
  </section>
);

export default AddTodo;
