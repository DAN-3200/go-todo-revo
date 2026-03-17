import * as wails from '../../../wailsjs/go/handlers/App';

export class NativeCommands {
	static Minimizar = async () => {
		await wails.Minimize();
	};
	static FullScreen = async () => {
		await wails.ToggleMaximize();
	};
   static CloseWindow = async () => {
		await wails.CloseWindow();
	};
}
