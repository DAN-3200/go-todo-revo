package handlers

import (
	"app-todo/backend/inner/contracts"
	"app-todo/backend/inner/usecase"
	"context"
)

type LayerController struct {
	UseCase *usecase.LayerUseCase
	Ctx     context.Context
}

// -- Constructor
func InitLayer(usecase *usecase.LayerUseCase) *LayerController {
	return &LayerController{
		UseCase: usecase,
	}
}

func (it *LayerController) Startup(ctx context.Context) {
	it.Ctx = ctx
}

// ------------------------------------------------------------------

func (it *LayerController) SaveToDo(info contracts.ToDoReq) (int64, error) {
	id, err := it.UseCase.SaveToDo(info)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (it *LayerController) GetToDo(id int64) *contracts.ToDoRes {
	response, err := it.UseCase.GetToDo(id)
	if err != nil {
		return nil
	}
	return &response
}

func (it *LayerController) GetToDoList() *[]contracts.ToDoRes {
	response, err := it.UseCase.GetToDoList()
	if err != nil {
		return nil
	}
	return &response
}

func (it *LayerController) EditToDo(id int64, info contracts.ToDoEditReq) error {
	err := it.UseCase.EditToDo(id, info)
	if err != nil {
		return err
	}
	return nil
}

func (it *LayerController) DeleteToDo(id int64) error {
	err := it.UseCase.DeleteToDo(id)
	if err != nil {
		return err
	}
	return nil
}
