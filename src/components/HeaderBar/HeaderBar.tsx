import { useEffect, useState } from 'react';
import { useAddTodoMutation } from '../../api/todosApi';
import styles from './HeaderBar.module.css';
import LogoImg from '../../assets/logo.svg';
import VectorImg from '../../assets/Vector.svg';
import Plus from '../../assets/plus.svg';
import toast from 'react-hot-toast';

export default function HeaderBar() {
	const [title, setTitle] = useState('');
	const [addTodo, { isLoading, isSuccess, isError, reset }] = useAddTodoMutation();

	useEffect(() => {
		if (isSuccess) {
			setTitle('');
			toast.success('Task added!');
			const t = setTimeout(() => reset(), 500);
			return () => clearTimeout(t);
		}
	}, [isSuccess, reset]);

	useEffect(() => {
		if (isError) {
			toast.error('Failed to add task');
			const t = setTimeout(() => reset(), 1200);
			return () => clearTimeout(t);
		}
	}, [isError, reset]);

	const submit = async () => {
		const v = title.trim();
		if (!v || isLoading) return;
		try {
			await addTodo({ title: v, status: 'todo' }).unwrap();
		} catch (e) {
			console.log(e);
		}
	};

	const renderBtnContent = () => {
		if (isLoading) return '…';
		if (isSuccess) return '✓';
		if (isError) return '!';
		return <img src={Plus} alt='' />;
	};

	return (
		<header className={styles.wrap}>
			<div className={styles.left}>
				<img src={LogoImg} alt='Task Master' className={styles.logo} />
				<input
					className={`${styles.inputPill} ${isError ? styles.err : ''}`}
					placeholder='Add a task...'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<button
					className={styles.plus}
					onClick={submit}
					disabled={isLoading || !title.trim()}
					aria-label='Create task'
					title='Create task'
				>
					{renderBtnContent()}
				</button>
			</div>

			<div className={styles.right}>
				<h1 className={styles.title}>Task Master</h1>
				<img src={VectorImg} alt='Vector' className={styles.vector} />
			</div>
		</header>
	);
}
