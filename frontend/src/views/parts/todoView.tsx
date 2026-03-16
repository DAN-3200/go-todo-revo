import React, { useEffect, useState, useMemo, memo } from 'react';
import { useAtom } from 'jotai';
import { ctxMain, ctxToDo } from '../../logic/store/main.store';
import { ToDoEntity } from '../../logic/entities/todo';
import clsx from 'clsx';
import * as luc from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TextareaAutosize from 'react-textarea-autosize';
import { ToDoLocalService } from '../../infra/services/local.service';

export function ToDoList() {
	const [DB, setDB] = useAtom(ctxMain.BagToDos);
	const [option] = useAtom(ctxMain.optionBar);
	const [search] = useAtom(ctxMain.search);

	useEffect(() => {
		(async () => {
			let list = await ToDoLocalService.GetToDoList();
			setDB(list ?? []);
		})();
	}, []);

	let list =
		option != 'todos'
			? DB?.filter((item) => item.status == option)
			: DB?.filter((item) => item.status != 'deletada');

	let filteredItems = useMemo(() => {
		return list.filter((item) =>
			item.desc.toLowerCase().includes(search.toLowerCase().trim())
		);
	}, [DB, option, search]);

	return (
		<div className='w-lg h-full overflow-auto flex flex-col items-center gap-2 no-scrollbar'>
			{filteredItems.length == 0 && (
				<div className='font-semibold text-black/50'>não há anotações</div>
			)}
			<AnimatePresence>
				{filteredItems
					.slice()
					.reverse()
					.map((item) => (
						<ToDoView
							key={item.id}
							info={item}
						/>
					))}
			</AnimatePresence>
		</div>
	);
}

const ToDoView = memo(({ info }: { info: ToDoEntity }) => {
	const [status, setStatus] = useState(info.status);
	const [desc, setDesc] = useState(info.desc);
	const [, setDB] = useAtom(ctxMain.BagToDos);
	const [, setModalView] = useAtom(ctxMain.modalView);
	const [, setIdItemRemove] = useAtom(ctxToDo.idItemRemove);

	const deleteSoftToDo = async () => {
		if (info.status != 'deletada') {
			await ToDoLocalService.EditToDo({ id: info.id, status: 'deletada' });
			setDB((prev) =>
				prev.map((item) =>
					item.id == info.id ? { ...item, status: 'deletada' } : item
				)
			);
		} else {
			setModalView('DeleteSoft');
			setIdItemRemove(info.id);
		}
	};
	const UpdateToDo = async () => {
		await ToDoLocalService.EditToDo({
			id: info.id,
			desc: desc,
			status: status,
		});
		setDB((prev) =>
			prev.map((item) =>
				item.id == info.id ? { ...item, desc: desc, status: status } : item
			)
		);
	};
	const RefreshToDo = async () => {
		await ToDoLocalService.EditToDo({ id: info.id, status: 'pendente' });
		setDB((prev) =>
			prev.map((item) =>
				item.id == info.id ? { ...item, status: 'pendente' } : item
			)
		);
	};

	useEffect(() => {
		UpdateToDo();
	}, [status, desc]);

	const [isEditing, setEditing] = useState(false);

	return (
		<motion.div
			key={info.id}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{ type: 'spring', stiffness: 500, damping: 50 }}
			layout
			autoFocus
			className='bg-white w-full rounded-lg shrink-0 h-max flex flex-col overflow-hidden'>
			<div className='m-2 p-1 grid place-items-start border-2 border-transparent hover:border-stone-300 transition-color rounded font-semibold '>
				{isEditing ? (
					<TextareaAutosize
						autoFocus
						maxRows={4}
						value={desc}
						readOnly={info.status == 'deletada' && true}
						onBlur={() => setEditing(false)}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
							info.status !== 'deletada' && setDesc(e.target.value)
						}
						className='transition-discrete scrollbar-thin text-base w-full px-2 outline-none text-[#28282b] resize-none overflow-y-auto'
					/>
				) : (
					<p
						onClick={() => setEditing(true)}
						className={clsx(
							'text-base px-2 cursor-text line-clamp-1 w-full h-full',
							desc.length != 0 ? 'text-stone-800' : 'text-stone-400'
						)}>
						{desc || 'Escreva...'}
					</p>
				)}
			</div>

			<div className='h-11 shrink-0 bg-stone-200 flex py-2 px-3 gap-2'>
				<button
					onClick={() =>
						status != 'deletada' &&
						setStatus((prev) =>
							prev == 'concluida' ? 'pendente' : 'concluida'
						)
					}
					className={clsx(
						'h-full w-21 px-2 font-semibold rounded grid place-content-center',
						status == 'deletada'
							? 'bg-stone-500/50 text-stone-700'
							: status == 'concluida'
							? 'bg-green-500/50  text-green-700 clickBTN cursor-pointer'
							: 'bg-orange-600/50 text-orange-700 clickBTN cursor-pointer'
					)}>
					{status == 'deletada'
						? 'deletada'
						: status == 'concluida'
						? 'concluido'
						: 'pendente'}
				</button>

				<span className='bg-stone-500/30 h-full w-max text-stone-600 font-semibold rounded cursor-default items-center gap-1 px-2 text-sm flex'>
					<luc.CalendarClock
						size={16}
						strokeWidth={2.5}
					/>
					{new Date(info.createdAt)
						.toLocaleDateString('pt-BR', {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
						})
						.replace('.', '')}
				</span>
				<div className='ml-auto flex gap-2'>
					{status == 'deletada' && (
						<button
							onClick={() => RefreshToDo()}
							className='hover:bg-blue-500/50 text-stone-400/50 clickBTN h-full w-max px-2 hover:text-blue-700 font-semibold rounded cursor-pointer grid place-content-center transition-colors'>
							restaurar
						</button>
					)}
					<button
						onClick={() => deleteSoftToDo()}
						className='hover:bg-red-500/50 text-stone-400 clickBTN h-full w-7 hover:text-red-700 font-bold rounded cursor-pointer grid place-content-center transition-colors'>
						<luc.Trash
							size={16}
							strokeWidth={2.5}
						/>
					</button>
				</div>
			</div>
		</motion.div>
	);
});

export function SoftDeleteToDo() {
	const [, setDB] = useAtom(ctxMain.BagToDos);
	const [idToDo] = useAtom(ctxToDo.idItemRemove);
	const [, setModalView] = useAtom(ctxMain.modalView);

	const TrueDeleteToDo = async () => {
		await ToDoLocalService.DeleteToDo(idToDo);
		setDB((prev) => prev.filter((item) => item.id != idToDo));
		setModalView(null);
	};

	return (
		<div className='bg-stone-50 h-max w-100 rounded-lg py-7 px-7 flex flex-col gap-5 justify-center items-center animate-surgir-in'>
			<div className='self-center'>
				<luc.TriangleAlert
					className='text-amber-500'
					size={52}
				/>
			</div>
			<div className='flex flex-col '>
				<span className='self-center font-bold text-base text-stone-800'>
					Deseja realmente excluir esta tarefa?
				</span>
				<span className='self-center text-justify text-sm text-stone-600'>
					Após a exclusão, não será possível recuperá-la.
				</span>
			</div>

			<div className='h-max flex gap-1 justify-center'>
				<button
					onClick={() => setModalView(null)}
					className='w-max min-w-30 bg-stone-400/50 text-stone-500 font-bold rounded px-3 py-1 text-base cursor-pointer clickBTN'>
					Cancel
				</button>
				<button
					onClick={() => TrueDeleteToDo()}
					className='w-max min-w-30 mt-auto bg-red-500/50 text-red-500 font-bold rounded px-3 py-1 text-base cursor-pointer clickBTN self-center'>
					Delete
				</button>
			</div>
		</div>
	);
}
