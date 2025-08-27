import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from '../api/todosApi';

export const store = configureStore({
	reducer: {
		[todosApi.reducerPath]: todosApi.reducer,
	},
	middleware: (gDM) => gDM().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
