package main

import (
	"app-todo/backend/inner/usecase"
	"app-todo/backend/outer/handlers"
	"app-todo/backend/outer/persistence/db"
	"app-todo/backend/outer/persistence/repository"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
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
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 1},
		OnStartup:        app.Startup,
		Bind: []any{
			app,
			todo,
		},
		Frameless: true,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
