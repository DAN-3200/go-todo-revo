package handlers

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Minimize() {
	runtime.WindowMinimise(a.ctx)
}

func (a *App) ToggleMaximize() {
	runtime.WindowToggleMaximise(a.ctx)
}

func (a *App) CloseWindow() {
	runtime.Quit(a.ctx)
}

