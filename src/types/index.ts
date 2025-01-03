export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: string;
  checklistId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
