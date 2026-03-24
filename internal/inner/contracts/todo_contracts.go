package contracts

import (
	"app-todo/internal/inner/entity"
	"time"
)

type ToDoReq struct {
	Desc   string `json:"desc" binding:"required"`
	Status string `json:"status"`
}

type ToDoRes struct {
	ID        int64     `json:"id"`
	Desc      string    `json:"desc"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

type ToDoEditReq struct {
	Desc   *string `json:"desc"`
	Status *string `json:"status"`
}

func ToToDoRes(t entity.ToDo) ToDoRes {
	return ToDoRes{
		ID:        t.ID,
		Desc:      t.Desc,
		Status:    t.Status,
		CreatedAt: t.CreatedAt,
	}
}

func ToToDoResList(list []entity.ToDo) []ToDoRes {
	res := make([]ToDoRes, 0, len(list))

	for _, t := range list {
		res = append(res, ToToDoRes(t))
	}

	return res
}
