import HeaderBar from './components/HeaderBar/HeaderBar';
import Board from './components/Board/Board';
import styles from './App.module.css';

export default function App() {
	return (
		<div className={styles.app}>
			<HeaderBar />
			<main className={styles.content}>
				<Board />
			</main>
		</div>
	);
}
