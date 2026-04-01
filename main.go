package main

import (
	"app-todo/internal/inner/usecase"
	"app-todo/internal/outer/handlers"
	"app-todo/internal/outer/persistence/db"
	"app-todo/internal/outer/persistence/repository"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:external/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := handlers.NewApp()

	conn := db.GetDB()
	repo, err := repository.InitLayer(conn)
	if err != nil {
		panic(err)
	}
	repo.CreateTable()
	uc := usecase.InitLayer(repo)
	todo := handlers.InitLayer(*uc)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "todo-app",
		Width:  1080,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Windows: &windows.Options{
			WebviewIsTransparent:              true,
			WindowIsTranslucent:               true,
			// DisableFramelessWindowDecorations: true,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		OnStartup:        app.Startup,
		Bind: []any{
			app,
			todo,
		},
		Frameless: true,
		// DisableResize: true,
		MinWidth: 840,
		MinHeight: 400,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
