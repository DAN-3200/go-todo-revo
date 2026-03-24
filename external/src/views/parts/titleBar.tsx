import * as luc from "lucide-react";
import { NativeCommands } from "../../infra/services/commands.wails";

export const TitleBar = () => {
  return (
    <div
      style={{ "--wails-draggable": "drag" }}
      className="flex flex-row w-screen justify-between items-center h-10 bg-transparent text-white px-3 select-none pt-2 mb-2"
    >
      <span className="font-medium text-xl">Lemure ToDo</span>

      <div className="flex space-x-2">
        <button
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-700/30 transition-colors rounded cursor-pointer"
          onClick={() => NativeCommands.Minimizar()}
        >
          <luc.Minimize className="w-4 h-4" />
        </button>
        <button
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-700/30 rounded transition-colors cursor-pointer"
          onClick={() => NativeCommands.FullScreen()}
        >
          <luc.Maximize className="w-4 h-4" />
        </button>
        <button
          className="w-6 h-6 flex items-center justify-center hover:bg-red-600/40 rounded transition-colors cursor-pointer"
          onClick={() => NativeCommands.CloseWindow()}
        >
          <luc.X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
