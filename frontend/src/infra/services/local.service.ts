// import { invoke } from '@tauri-apps/api/core';
import { ToDoEntity, ToDoStatus } from '../../logic/entities/todo';

export class ToDoLocalService {
	static SaveToDo = async (
		status: ToDoStatus | 'todos'
	): Promise<ToDoEntity> => {
		const response = await invoke<ToDoEntity>('save_todo', {
			status: status == 'todos' ? 'pendente' : status,
		});
		return response;
	};

	// *Error Handling
	static GetToDoList = async (): Promise<ToDoEntity[] | void> => {
		const response = await invoke<ToDoEntity[]>('get_todo_list').catch(
			(err) => {
				console.error('Error:', err);
			}
		);
		return response;
	};

	static EditToDo = async (todo: Partial<ToDoEntity>): Promise<void> => {
		await invoke('edit_todo_list', {
			id: todo.id!,
			desc: todo.desc!,
			status: todo.status,
		}).catch((err) => {
			console.error('Error:', err);
		});
	};

	static DeleteToDo = async (id: number): Promise<void> => {
		await invoke('delete_todo', { id: id }).catch((err) => {
			console.error('Error:', err);
		});
	};
}
