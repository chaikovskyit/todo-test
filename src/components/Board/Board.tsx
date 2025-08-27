import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useGetTodosQuery, useUpdateTodoMutation } from '../../api/todosApi';
import Column from '../Column/Column';
import type { Todo, TodoStatus } from '../../types';
import styles from './Board.module.css';
import toast from 'react-hot-toast';

import TodoIcon from '../../assets/todo.svg';
import DoingIcon from '../../assets/doing.svg';
import DoneIcon from '../../assets/done.svg';

const COLUMNS: { key: TodoStatus; title: string; icon: string }[] = [
	{ key: 'todo', title: 'To do', icon: TodoIcon },
	{ key: 'inProgress', title: 'Doing', icon: DoingIcon },
	{ key: 'done', title: 'Done', icon: DoneIcon },
];

export default function Board() {
	const { data, isFetching } = useGetTodosQuery();
	const todos: Todo[] = Array.isArray(data) ? data : [];
	const [updateTodo] = useUpdateTodoMutation();

	const onDragEnd = async (res: DropResult) => {
		const { destination, source, draggableId } = res;
		if (!destination) return;

		const destKey = destination.droppableId as TodoStatus;
		const srcKey = source.droppableId as TodoStatus;

		if (destKey === srcKey && destination.index === source.index) return;

		try {
			await updateTodo({ id: draggableId, status: destKey, order: destination.index }).unwrap();
			toast.success('Task moved!');
		} catch {
			toast.error('Failed to move task');
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.columns}>
				<DragDropContext onDragEnd={onDragEnd}>
					{COLUMNS.map((col) => {
						const list = todos.filter((t) => t.status === col.key);

						return (
							<Droppable droppableId={col.key} key={col.key}>
								{(prov) => (
									<div ref={prov.innerRef} {...prov.droppableProps}>
										<Column title={col.title} icon={col.icon} highlight={col.key === 'inProgress'}>
											{list.length === 0 && !isFetching && (
												<div className={styles.empty}>No tasks</div>
											)}

											{list.map((t, i) => (
												<Draggable key={t.id} draggableId={t.id} index={i}>
													{(p) => (
														<div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
															<Column.Card todo={t} />
														</div>
													)}
												</Draggable>
											))}

											{prov.placeholder}
										</Column>
									</div>
								)}
							</Droppable>
						);
					})}
				</DragDropContext>
			</div>
		</div>
	);
}
