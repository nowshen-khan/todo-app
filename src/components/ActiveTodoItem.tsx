"use client";
import React, {forwardRef} from "react";
import { Todo } from "@/utils/types";
import { importanceLabel, importanceBadge } from "@/utils/importance";

interface Props {
  todo: Todo;
  startEdit: (t: Todo) => void;
  toggleComplete: (id: string, completed: boolean) => void;
  deleteTask: (id: string) => void;
  togglePin: (id: string) => void;
  changeImportance: (id: string, imp: Todo["importance"]) => void;
  editingId: string | null;
  editingText: string;
  setEditingText: (v: string) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;

  draggableProps?: any;   // ✅ added
  dragHandleProps?: any;  // ✅ added
}

/** Forward ref for Draggable */
const ActiveTodoItem = React.forwardRef<HTMLLIElement, Props>(({
  todo,
  startEdit,
  toggleComplete,
  deleteTask,
  togglePin,
  changeImportance,
  editingId,
  editingText,
  setEditingText,
  saveEdit,
  cancelEdit,
  draggableProps,
  dragHandleProps,
}, ref) => {
  return (
    <li
      ref={ref}
      {...draggableProps}     // ✅ draggable props
      {...dragHandleProps}    // ✅ drag handle
      className="flex items-center justify-between gap-4 p-3 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-transform hover:scale-105"
    >
      <div className="flex items-start gap-3 flex-1">
        <button
          onClick={() => togglePin(todo.id)}
          className={`mt-1 rounded px-1 py-0.5 ${todo.pinned ? "text-yellow-400" : "text-slate-300"}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={todo.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>

        <div className="flex flex-col min-w-0">
          {editingId === todo.id ? (
            <div className="flex gap-2 items-center">
              <input
                className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent w-full"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <button onClick={() => saveEdit(todo.id)} className="px-2 py-1 bg-green-600 text-white rounded-md">
                Save
              </button>
              <button onClick={cancelEdit} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{todo.text}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${importanceBadge[todo.importance]}`}>
                  {importanceLabel[todo.importance]}
                </span>
              </div>
              <div className="text-sm text-slate-400">{todo.category}</div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => startEdit(todo)} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">Edit</button>

        <select
          value={todo.importance}
          onChange={(e) => changeImportance(todo.id, e.target.value as Todo["importance"])}
          className="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent text-sm"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button onClick={() => toggleComplete(todo.id, todo.completed)} className="px-2 py-1 bg-emerald-500 text-white rounded-md text-sm">Done</button>
        <button onClick={() => deleteTask(todo.id)} className="px-2 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
      </div>
    </li>
  );
});

export default ActiveTodoItem;
