import Todo from "./todo.js";

const apiRoot = "http://localhost:3000";

class TodoStorage {
  constructor() {
    this.currentId = 0;
    this.todoCount = 0;

    this.postponedTodos = 0;
    this.completedTodos = 0;
    this.deletedTodos = 0;
  }

  convertToViewDto(todoDto) {
    return {
      id: todoDto.id,
      text: todoDto.text,
      state: todoDto.state,
      dateCreated: new Date(todoDto.dateCreated),
      dateCompleted:
      todoDto.dateCompleted !== null ? new Date(todoDto.dateCompleted) : null,
    };
  }

  convertToTodo(todoDto) {
    const todo = new Todo(todoDto.text);
    todo.state = todoDto.state;
    todo.dateCreated = new Date(todoDto.dateCreated);
    todo.dateCompleted =
      todoDto.dateCompleted === null ? null : new Date(todoDto.dateCompleted);

    return todo;
  }

  async createTodo(text) {
    const newTodo = new Todo(text);

    const addResponse = await fetch(`${apiRoot}/todos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (!addResponse.ok) {
      console.log(`Error with status ${addResponse.status}`);
      return;
    }

    console.log(`Ok with status ${addResponse.status}`);

    this.todoCount += 1;
  }

  totalTodoCount() {
    return this.todoCount;
  }

  postponedTodos() {
    return this.postponedTodos;
  }

  completedTodos() {
    return this.completedTodos;
  }

  deletedTodos() {
    return this.deletedTodos;
  }

  resumedTodos() {
    return this.resumedTodos;
  }

  async getTodoDtoById(id) {
    const todoResponse = await fetch(`${apiRoot}/todos/${id}`);

    if (!todoResponse.ok) {
      console.log(`Error with status ${todoResponse.status}`);
      return;
    }

    console.log(`Ok with status ${todoResponse.status}`);

    return await todoResponse.json();
  }

  async getTodoById(id) {
    return this.convertToViewDto(await this.getTodoDtoById(id));
  }
  
  async patchTodo(todoId, patch) {
    const patchResponse = await fetch(`${apiRoot}/todos/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    });

    if (!patchResponse.ok) {
      console.log(`Error with status ${patchResponse.status}`);
      return;
    }

    console.log(`Ok with status ${patchResponse.status}`);

    const patchedTodo = await patchResponse.json();

    return patchedTodo.id;
  }

  async postponeById(id) {
    const todo = this.convertToTodo(this.getTodoDtoById(id));  
    todo.postpone();
    this.postponedTodos += 1;
    this.resumedTodos -= 1;

    const patch = { state: todo.state };
    return await this.patchTodo(id, patch);
  }

  async resumeById(id) {
    const todo = this.convertToTodo(this.getTodoDtoById(id));
    todo.resume();
    this.postponedTodos -= 1;

    const patch = { state: todo.state };
    return await this.patchTodo(id, patch);
  }

  async completeById(id) {
    const todo = this.convertToTodo(this.getTodoDtoById(id));
    todo.done();
    this.completedTodos += 1;

    const patch = {
      state: todo.state,
      dateCompleted: todo.dateCompleted,
    };
    return await this.patchTodo(id, patch);
  }

  async deleteById(id) {
    const deleteResponse = await fetch(`${apiRoot}/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!deleteResponse.ok) {
      console.log(`Error with status ${deleteResponse.status}`);
      return;
    }

    console.log(`Ok with status ${deleteResponse.status}`);

    this.todoCount -= 1;
    this.deletedTodos += 1;
  }

  async getAllTodo() {
    const allTodoResponse = await fetch(`${apiRoot}/todos/`);

    if (!allTodoResponse.ok) {
      console.log(`Error with status ${allTodoResponse.status}`);
      return;
    }

    console.log(`Ok with status ${allTodoResponse.status}`);

    const returnedDto = await allTodoResponse.json();

    this.todoCount = returnedDto.length;

    return returnedDto.map((dto) => this.convertToViewDto(dto));
  }
}

const todoStorage = new TodoStorage();

export default todoStorage;
