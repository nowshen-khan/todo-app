export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  importance: "high" | "medium" | "low";
  pinned?: boolean;
  createdAt?: string;
}
