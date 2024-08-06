export interface Todo {
  eid?: number;
  what_to_do: string;
  due_date: string;
  status?: string;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface TodoResponse {
  todo: Todo;
}
