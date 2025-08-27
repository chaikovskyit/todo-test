import styles from './TodoCard.module.css';
import type { Todo } from '../../types';
import { useDeleteTodoMutation } from '../../api/todosApi';
import toast from 'react-hot-toast';

export default function TodoCard({ todo }: { todo: Todo }) {
	const [del, { isLoading }] = useDeleteTodoMutation();

	const handleDelete = async () => {
		try {
			await del(todo.id).unwrap();
			toast.success('Task deleted!');
		} catch {
			toast.error('Failed to delete task');
		}
	};

	return (
		<article className={styles.card}>
			<div className={styles.top}>
				<h3 className={styles.title}>{todo.title}</h3>
				<button
					className={styles.delete}
					disabled={isLoading}
					onClick={handleDelete}
					aria-label='Delete todo'
				>
					×
				</button>
			</div>
		</article>
	);
}
