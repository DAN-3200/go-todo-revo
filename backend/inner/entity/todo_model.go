package entity

import (
	"app-todo/backend/inner/vo"
	"strings"
	"time"
)

type ToDo struct {
	ID        int64
	Desc      string
	Status    string
	CreatedAt time.Time
}

func NewToDo(content string) *ToDo {
	return &ToDo{
		ID:        0,
		Desc:      strings.ToLower(content),
		Status:    vo.Pendente,
		CreatedAt: time.Now(),
	}
}
