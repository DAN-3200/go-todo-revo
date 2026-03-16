import { useAtom } from 'jotai';
import { ctxMain } from '../logic/store/main.store';
import { FilterStatus, NavBar } from './parts/navBar';
import { SoftDeleteToDo, ToDoList } from './parts/todoView';
import { JSX } from 'react/jsx-runtime';
import { motion, AnimatePresence } from 'motion/react';
import { TitleBar } from './parts/titleBar';

export default function ToDoApp() {
	document.getElementsByTagName('title')[0].innerHTML = 'Simple ToDo App';

	const [modalView] = useAtom(ctxMain.modalView);
	const modalOptions: { [key: string]: JSX.Element } = {
		DeleteSoft: <SoftDeleteToDo />,
	};

	return (
		<div className='h-screen w-screen bg-pastel-purple'>
			<TitleBar />
			<div className=' p-2 flex flex-col items-center gap-3'>
				<NavBar />
				<FilterStatus />
				<ToDoList />
			</div>
			<AnimatePresence>
				{modalView && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 grid place-items-center bg-black/50'>
						{modalOptions[modalView]}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
