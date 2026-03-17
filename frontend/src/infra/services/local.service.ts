import * as wails from "../../../wailsjs/go/handlers/LayerController";
import { ToDoEntity, ToDoStatus } from "../../logic/entities/todo";

export class ToDoLocalService {
  static SaveToDo = async (
    status: ToDoStatus | "todos",
  ): Promise<ToDoEntity> => {
    const response = await wails.SaveToDo({
      title: "",
      content: "",
      status: false,
    });
    return { id: response, createdAt: new Date(), desc: "", status: status };
  };

  // *Error Handling
  static GetToDoList = async (): Promise<ToDoEntity[] | void> => {
    const response = await wails.GetToDoList();
    return response;
  };

  static EditToDo = async (todo: Partial<ToDoEntity>): Promise<void> => {
    await wails
      .EditToDo(todo.id!, {
        id: todo.id!,
        desc: todo.desc!,
        status: todo.status,
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  static DeleteToDo = async (id: number): Promise<void> => {
    await wails.DeleteToDo(id);
  };
}
