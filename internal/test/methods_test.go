package test_test

import (
	"app-todo/internal/inner/contracts"
	"app-todo/internal/inner/usecase"
	"app-todo/internal/outer/handlers"
	"app-todo/internal/outer/persistence/db"
	"app-todo/internal/outer/persistence/repository"
	"fmt"
	"testing"
)

func BaseArch() *handlers.LayerController {
	conn := db.GetDB()
	repo, err := repository.InitLayer(conn)
	if err != nil {
		panic(err)
	}
	repo.CreateTable()
	uc := usecase.InitLayer(repo) 
	todo := handlers.InitLayer(*uc)

	return todo
}

func TestSave(t *testing.T) {
	todo := BaseArch()

	r, err := todo.SaveToDo(contracts.ToDoReq{ Desc:"Beatriz", Status: "pendente"})
	if err != nil {
		t.Error(err.Error())
	}
	fmt.Println(r)
}

func TestGetList(t *testing.T) {
	todo := BaseArch()

	r, err := todo.GetToDoList()
	if err != nil {
		t.Error(err.Error())
	}
	fmt.Println(r)
}