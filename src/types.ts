export type TodoStatus = 'todo' | 'inProgress' | 'done';

export interface Todo {
	id: string;
	title: string;
	status: TodoStatus;
	createdAt?: string;
	order?: number;
}
