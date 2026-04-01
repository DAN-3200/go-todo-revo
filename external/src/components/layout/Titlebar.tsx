import React from 'react';
import { IconButton } from '../ui/IconButton';
import { NativeCommands } from '@/infra/services/commands.wails';
import * as luc from 'lucide-react';

interface TitlebarProps {
	noteCount: number;
	onNewNote: () => void;
}

export function Titlebar({ noteCount, onNewNote }: TitlebarProps) {
	return (
		<header
			className='wails-draggable h-11 bg-white border-b border-zinc-200 flex items-center
      justify-between px-4 flex-shrink-0 select-none'
		>
			{/* Brand */}
			<div className='flex items-center gap-2'>
				<div className='w-[18px] h-[18px] bg-zinc-900 grid place-items-center flex-shrink-0'>
					<div className='w-1.5 h-1.5 bg-green-400' />
				</div>
				<span className='text-[13px] font-semibold tracking-tight'>
					Notas
				</span>
				<span className='font-mono text-[10px] text-zinc-400'>
					— {noteCount} nota{noteCount !== 1 ? 's' : ''}
				</span>
			</div>

			{/* Actions */}
			<div className='flex items-center gap-1.5'>
				<button
					className='p-1.5 flex items-center justify-center text-zinc-400 hover:text-zinc-700 border border-transparent hover:border-zinc-300 hover:bg-gray-700/10 transition-colors  cursor-pointer'
					onClick={() => NativeCommands.Minimizar()}
				>
					<luc.Minimize className='w-4 h-4' />
				</button>
				<button
					className='p-1.5 flex items-center justify-center  text-zinc-400 hover:text-zinc-700 border border-transparent hover:border-zinc-300 hover:bg-gray-700/10  transition-colors cursor-pointer'
					onClick={() => NativeCommands.FullScreen()}
				>
					<luc.Maximize className='w-4 h-4' />
				</button>
				<button
					className='p-1.5 flex items-center justify-center  text-zinc-400 border border-transparent hover:border-zinc-300 hover:bg-red-600/10 hover:text-red-800 transition-colors cursor-pointer'
					onClick={() => NativeCommands.CloseWindow()}
				>
					<luc.X className='w-4 h-4' />
				</button>
			</div>
		</header>
	);
}
