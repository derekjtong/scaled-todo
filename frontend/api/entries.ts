import { TODO_API_URL } from "@/lib/config";
import { Todo, TodoResponse, TodosResponse } from "@/types/Entry";
import axios, { AxiosResponse } from "axios";

export const getTodos = async (authToken: string): Promise<AxiosResponse<TodosResponse>> => {
  return axios.get<TodosResponse>(`${TODO_API_URL}/api/items`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const addTodo = async (authToken: string, todo: Todo): Promise<AxiosResponse<TodoResponse>> => {
  return axios.post<TodoResponse>(`${TODO_API_URL}/api/items`, todo, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteTodo = async (authToken: string, todo: Todo): Promise<AxiosResponse<TodoResponse>> => {
  return axios.delete<TodoResponse>(`${TODO_API_URL}/api/items/${todo.eid}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const markDoneTodo = async (authToken: string, todo: Todo): Promise<AxiosResponse<TodoResponse>> => {
  return axios.put<TodoResponse>(`${TODO_API_URL}/api/items/${todo.eid}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
