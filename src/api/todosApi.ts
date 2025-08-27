import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo, TodoStatus } from '../types';

export const todosApi = createApi({
	reducerPath: 'todosApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL,
	}),
	tagTypes: ['Todos'],
	endpoints: (build) => ({
		getTodos: build.query<Todo[], void>({
			query: () => '/todos',
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Todos' as const, id })),
							{ type: 'Todos' as const, id: 'LIST' },
					  ]
					: [{ type: 'Todos' as const, id: 'LIST' }],
			transformResponse: (res: Todo[]) => res.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		}),

		addTodo: build.mutation<Todo, Partial<Todo>>({
			query: (body) => ({
				url: '/todos',
				method: 'POST',
				body,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const patch = dispatch(
					todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
						draft.push({
							id: `tmp-${Date.now()}`,
							title: arg.title ?? 'Untitled',
							status: (arg.status ?? 'todo') as TodoStatus,
							createdAt: new Date().toISOString(),
							order: (draft.filter((d) => d.status === (arg.status ?? 'todo')).length ?? 0) + 1,
						});
					}),
				);
				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
		}),

		updateTodo: build.mutation<Todo, Partial<Todo> & Pick<Todo, 'id'>>({
			query: ({ id, ...body }) => ({
				url: `/todos/${id}`,
				method: 'PUT',
				body,
			}),
			async onQueryStarted({ id, ...patchData }, { dispatch, queryFulfilled }) {
				const patch = dispatch(
					todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
						const idx = draft.findIndex((t) => t.id === id);
						if (idx !== -1) draft[idx] = { ...draft[idx], ...patchData };
					}),
				);
				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			invalidatesTags: (_r, _e, { id }) => [{ type: 'Todos', id }],
		}),

		deleteTodo: build.mutation<{ success: boolean; id: string }, string>({
			query: (id) => ({ url: `/todos/${id}`, method: 'DELETE' }),
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				const patch = dispatch(
					todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
						const idx = draft.findIndex((t) => t.id === id);
						if (idx !== -1) draft.splice(idx, 1);
					}),
				);
				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			invalidatesTags: (_r, _e, id) => [
				{ type: 'Todos', id },
				{ type: 'Todos', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetTodosQuery,
	useAddTodoMutation,
	useUpdateTodoMutation,
	useDeleteTodoMutation,
} = todosApi;
