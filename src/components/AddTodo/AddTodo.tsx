import { useEffect, useState } from 'react';
import styles from './AddTodo.module.css';
import { useAddTodoMutation } from '../../api/todosApi';

export default function AddTodo({
	inputRef,
}: {
	inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}) {
	const [title, setTitle] = useState('');
	const [add, { isLoading, isSuccess, isError }] = useAddTodoMutation();

	useEffect(() => {
		if (isSuccess) setTitle('');
	}, [isSuccess]);
	useEffect(() => {
		if (inputRef) inputRef.current = document.getElementById('add-input') as HTMLInputElement;
	}, [inputRef]);

	return (
		<form
			className={styles.wrap}
			onSubmit={(e) => {
				e.preventDefault();
				if (!title.trim()) return;
				add({ title, status: 'todo' });
			}}
		>
			<input
				id='add-input'
				className={styles.input}
				placeholder='Add a task…'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<button className={styles.btn} disabled={isLoading}>
				{isLoading ? 'Adding…' : isSuccess ? 'Added ✓' : isError ? 'Retry ⟳' : 'Add'}
			</button>
		</form>
	);
}
