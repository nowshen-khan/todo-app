"use client";
import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import ActiveTodoItem from "@/components/ActiveTodoItem";
import { Todo } from "@/utils/types";

interface Props {
  todos: Todo[];
  editingId: string | null;
  editingText: string;
  setEditingText: (v: string) => void;
  startEdit: (t: Todo) => void;
  toggleComplete: (id: string, completed: boolean) => void;
  deleteTask: (id: string) => void;
  togglePin: (id: string) => void;
  changeImportance: (id: string, imp: Todo["importance"]) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  onDragEnd: (result: DropResult) => void;
}

const TodoList = ({
  todos,
  editingId,
  editingText,
  setEditingText,
  startEdit,
  toggleComplete,
  deleteTask,
  togglePin,
  changeImportance,
  saveEdit,
  cancelEdit,
  onDragEnd,
}: Props) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="activeList">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3 mb-6"
          >
            {todos.map((t, idx) => (
              <Draggable key={t.id} index={idx} draggableId={t.id}>
                {(prov) => (
                  <ActiveTodoItem
                    ref={prov.innerRef}
                    todo={t}
                    startEdit={startEdit}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                    togglePin={togglePin}
                    changeImportance={changeImportance}
                    editingId={editingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    draggableProps={prov.draggableProps}     // ✅ must pass
                    dragHandleProps={prov.dragHandleProps}   // ✅ must pass
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
