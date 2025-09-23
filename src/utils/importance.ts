// utils/importance.ts
import { Todo } from "./types";

export const importanceLabel: Record<Todo["importance"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const importanceBadge: Record<Todo["importance"], string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};
