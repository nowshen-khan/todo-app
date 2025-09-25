"use client";
import React from "react";
import { Todo } from "@/utils/types";
import { importanceBadge, importanceLabel } from "@/utils/importance";

interface Props {
  todo: Todo;
  toggleComplete: (id: string, completed: boolean) => void;
  deleteTask: (id: string) => void;
}

const CompletedTodoItem: React.FC<Props> = ({ todo, toggleComplete, deleteTask }) => (
  <li className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-slate-600 dark:text-slate-200">{todo.text}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${importanceBadge[todo.importance]}`}>
          {importanceLabel[todo.importance]}
        </span>
        {todo.pinned && <span className="text-yellow-400 text-sm">★</span>}
      </div>
      <div className="text-sm text-slate-400">{todo.category}</div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => toggleComplete(todo.id, todo.completed)}
        className="px-2 py-1 bg-yellow-500 text-white rounded-md text-sm"
      >
        Undo
      </button>
      <button
        onClick={() => deleteTask(todo.id)}
        className="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
      >
        Delete
      </button>
    </div>
  </li>
);

export default CompletedTodoItem;
