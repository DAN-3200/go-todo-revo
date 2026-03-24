import { useAtom } from 'jotai';
import { ctxMain } from '../../logic/store/main.store';
import { ToDoStatus } from '../../logic/entities/todo';
import clsx from 'clsx';
import * as luc from 'lucide-react';
import { ToDoLocalService } from '../../infra/services/local.service';

export function NavBar() {
	const [, setDB] = useAtom(ctxMain.BagToDos);
	const [option] = useAtom(ctxMain.optionBar);
	const [search, setSearch] = useAtom(ctxMain.search);

	const SaveToDo = async () => {
		const newToDo = await ToDoLocalService.SaveToDo(option);
		setDB((prev) => [...prev, newToDo]);
	};

	return (
		<div className='shrink-0 w-136 bg-white p-2 h-13 flex gap-1 rounded-lg text-sm flex-row '>
			<div className=' bg-stone-200 focus-within:bg-stone-300 transition-colors w-full rounded font-semibold text-[#28282b] px-2 text-base flex items-center gap-2'>
				<luc.Search
					size={16}
					strokeWidth={3.5}
					className='text-stone-500'
				/>
				<input
					type='text'
					name=''
					id=''
					value={search}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setSearch(e.target.value)
					}
					className='w-full h-full outline-none'
				/>
			</div>

			<button
				onClick={() => option != 'deletada' && search.length <= 0 && SaveToDo()}
				className={clsx(
					'rounded px-4 w-4 bg-green-off text-white font-bold text-[20px]  grid place-content-center',
					option != 'deletada' && search.length <= 0
						? 'clickBTN cursor-pointer'
						: 'opacity-40'
				)}>
				<luc.CirclePlus
					strokeWidth={2}
					size={20}
					className='text-white'
				/>
			</button>
		</div>
	);
}

export function FilterStatus() {
	const [option, setOption] = useAtom(ctxMain.optionBar);
	const OptionBar = ({ text }: { text: ToDoStatus | 'todos' }) => (
		<button
			onClick={() => setOption(text)}
			className='px-2'>
			<span
				className={clsx(
					'transition-all cursor-pointer text-base font-semibold',
					option == text ? 'text-white' : 'text-black/70 hover:text-black'
				)}>
				{text}
			</span>
		</button>
	);

	return (
		<div className='flex items-center gap-1 '>
			<OptionBar text='todos' />
			<strong className='opacity-50 cursor-default'>|</strong>
			<OptionBar text='pendente' />
			<OptionBar text='concluida' />
			<strong className='opacity-50 cursor-default'>|</strong>
			<OptionBar text='deletada' />
		</div>
	);
}
