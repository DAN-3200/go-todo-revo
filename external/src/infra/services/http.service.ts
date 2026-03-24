// services = recebe e retorna informação
import { ToDoEntity, ToDoStatus } from '../../logic/entities/todo';

export class ToDoCloudService {
	static SaveToDo = async (
		status: ToDoStatus | 'todos'
	): Promise<ToDoEntity> => {
		let response = await fetch('http://127.0.0.1:8000/todo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: 0,
				desc: '',
				status: status == 'todos' ? 'pendente' : status,
				createdAt: new Date(),
			} as ToDoEntity),
		});

		return (await response.json()) as ToDoEntity;
	};

	static GetToDoList = async (): Promise<ToDoEntity[]> => {
		let resp: ToDoEntity[];
		try {
			resp = (await (
				await fetch('http://127.0.0.1:8000/todo')
			).json()) as ToDoEntity[];
		} catch (error) {
			resp = [];
			console.log(`Error: ${error}`);
		}
		return resp;
	};

	static EditToDo = async (todo: Partial<ToDoEntity>): Promise<void> => {
		await fetch(`http://127.0.0.1:8000/todo/${todo.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(todo),
		});
	};

	static DeleteToDo = async (id: string): Promise<void> => {
		await fetch(`http://127.0.0.1:8000/todo?id=${id}`, {
			method: 'DELETE',
		});
	};
}
