import { atom } from 'jotai';
import { ToDoEntity, ToDoStatus } from '../entities/todo';

export const ctxMain = {
	BagToDos: atom<ToDoEntity[]>([] as ToDoEntity[]),
	optionBar: atom<ToDoStatus | 'todos'>('todos'),
	search: atom<string>(''),
	modalView: atom<string | null>(),
};

export const ctxToDo = {
	idItemRemove: atom<any>(),
};
