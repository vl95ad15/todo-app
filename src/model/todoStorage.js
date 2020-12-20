import Todo from "./todo.js";

class TodoStorage {
  constructor() {
    this.storage = {};

    this.currentId = 0;
    this.todoCount = 0;

    this.postponedTodos = 0;
    this.completedTodos = 0;
    this.deletedTodos = 0;
  }

  createTodo(text) {
    const newTodo = new Todo(text);
    this.storage[this.currentId] = newTodo;
    this.currentId += 1;
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

  getTodoById(id) {
    const todo = this.storage[id];
    return {
      id,
      text: todo.text,
      state: todo.state,
      dateCreated: new Date(todo.dateCreated),
      dateCompleted:
        todo.dateCompleted !== null ? new Date(todo.dateCompleted) : null,
    };
  }

  postponeById(id) {
    const todo = this.storage[id];
    todo.postpone();
    this.postponedTodos += 1;
    this.resumedTodos -= 1;
  }

  resumeById(id) {
    const todo = this.storage[id];
    todo.resume();
    this.postponedTodos -= 1;
  }

  completeById(id) {
    const todo = this.storage[id];
    todo.done();
    this.completedTodos += 1;
  }

  deleteById(id) {
    delete this.storage[id];
    this.todoCount -= 1;
    this.deletedTodos += 1;
  }

  getAllTodo() {
    return Object.keys(this.storage).map((key) => {
      const todo = this.storage[key];

      return {
        id: key,
        text: todo.text,
        state: todo.state,
        dateCreated: new Date(todo.dateCreated),
        dateCompleted:
          todo.dateCompleted !== null ? new Date(todo.dateCompleted) : null,
      };
    });
  }
}

const todoStorage = new TodoStorage();

export default todoStorage;
