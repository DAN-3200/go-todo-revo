package usecase

import (
	"app-todo/internal/inner/contracts"
	"app-todo/internal/inner/entity"
	"app-todo/internal/inner/ports"
	"fmt"
)

type LayerUseCase struct {
	Repo ports.Irepository[entity.ToDo]
}

func InitLayer(repository ports.Irepository[entity.ToDo]) *LayerUseCase {
	return &LayerUseCase{
		Repo: repository,
	}
}

// ------------------------------------------------------------------

func (it *LayerUseCase) SaveToDo(info contracts.ToDoReq) (int64, error) {
	todo := entity.NewToDo(info.Desc)
	id, err := it.Repo.Save(*todo)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func (it *LayerUseCase) GetToDo(id int64) (contracts.ToDoRes, error) {
	result, err := it.Repo.Get(id)
	if err != nil {
		return contracts.ToDoRes{}, err
	}

	return contracts.ToToDoRes(result), err
}

func (it *LayerUseCase) GetToDoList() (*[]contracts.ToDoRes, error) {
	result, err := it.Repo.GetList()
	if err != nil {
		return nil, err
	}

	obj := contracts.ToToDoResList(result)

	return &obj, nil
}

func (it *LayerUseCase) EditToDo(id int64, info contracts.ToDoEditReq) error {

	todo, err := it.Repo.Get(id)
	if err != nil {
		return fmt.Errorf("não há elemento com tal id")
	}

	if info.Desc != nil {
		todo.Desc = *info.Desc
	}

	if info.Status != nil {
		todo.Status = *info.Status
	}

	err = it.Repo.Edit(todo)
	if err != nil {
		return err
	}

	return nil
}

func (it *LayerUseCase) DeleteToDo(id int64) error {
	err := it.Repo.Delete(id)
	if err != nil {
		return err
	}

	return nil
}
