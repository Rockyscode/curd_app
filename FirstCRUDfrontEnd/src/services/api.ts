import axios from "axios";
import { Todo } from "../types/todo";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://my-todo-app:8080/api/todos";

// const API_BASE_URL = "http://my-todo-app:8080/api/todos";

const API_BASE_URL = "http://129.159.232.131:8080/api/todos";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 6000,
});

export const todoApi = {
  // Fetch all todos
  getAll: async (): Promise<Todo[]> => {
    const response = await apiClient.get<Todo[]>("");
    return response.data;
  },

  // Fetch single todo by id
  getById: async (id: number): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/${id}`);
    return response.data;
  },

  // Create new todo
  create: async (todo: Omit<Todo, "id">): Promise<Todo> => {
    const response = await apiClient.post<Todo>("", todo);
    return response.data;
  },

  // Update existing todo
  update: async (id: number, todo: Partial<Todo>): Promise<Todo> => {
    const response = await apiClient.put<Todo>(`/${id}`, todo);
    return response.data;
  },

  // Delete todo by id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },

  // Check health / connection to backend
  checkHealth: async (): Promise<boolean> => {
    try {
      await apiClient.get("", { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  },
};
