import styles from './Column.module.css';
import type { Todo } from '../../types';
import TodoCard from '../TodoCard/TodoCard';

export default function Column({
	title,
	icon,
	highlight,
	children,
}: {
	title: string;
	icon?: string;
	highlight?: boolean;
	children: React.ReactNode;
}) {
	return (
		<section className={`${styles.col} ${highlight ? styles.highlight : ''}`}>
			<h2 className={styles.title}>
				{title} {icon && <img src={icon} alt='' className={styles.ic} />}
			</h2>
			<div className={styles.list}>{children}</div>
		</section>
	);
}
Column.Card = function ColumnCard({ todo }: { todo: Todo }) {
	return <TodoCard todo={todo} />;
};
