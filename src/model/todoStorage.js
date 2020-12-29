import Todo from "./todo.js";

const apiRoot = "http://localhost:3000";

class TodoStorage {
  constructor() {
    this.storage = {};

    this.currentId = 0;
    this.todoCount = 0;

    this.postponedTodos = 0;
    this.completedTodos = 0;
    this.deletedTodos = 0;
  }

  async createTodo(text) {
    const newTodo = new Todo(text);
    this.storage[this.currentId] = newTodo;
    this.currentId += 1;
    this.todoCount += 1;

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
  
    const addedTodo = await addResponse.json();
  
    return addedTodo.id;
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

  async updateTodo(todoId, todo) {
    const updateResponse = await fetch(`${apiRoot}/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
  
    if (!updateResponse.ok) {
      console.log(`Error with status ${updateResponse.status}`);
      return;
    }
  
    console.log(`Ok with status ${updateResponse.status}`);
  
    const updatedTodo = await updateResponse.json();
  
    return updatedTodo.id;
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

  async deleteTodo(todoId, todo) {
    const deleteResponse = await fetch(`${apiRoot}/todos/${todoId}`, {
      method: "DELETE",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(todo),
    });
  
    if (!deleteResponse.ok) {
      console.log(`Error with status ${deleteResponse.status}`);
      return;
    }
  
    console.log(`Ok with status ${deleteResponse.status}`);
  
    const deletedTodo = await deleteResponse.json();
  
    return deletedTodo.id;
  }

  async postponeById(id) {
    const todo = this.storage[id];
    todo.postpone();
    this.postponedTodos += 1;
    this.resumedTodos -= 1;
    const patch = { state: todo.state };
    return await patchTodo(id, patch);
  }

  // postponeById(id) {
  //   const todo = this.storage[id];
  //   todo.postpone();
  //   this.postponedTodos += 1;
  //   this.resumedTodos -= 1;
  // }

  async resumeById(id) {
    const todo = this.storage[id];
    todo.resume();
    this.postponedTodos -= 1;
    const patch = { state: todo.state };
    return await patchTodo(id, patch);
  }

  // resumeById(id) {
  //   const todo = this.storage[id];
  //   todo.resume();
  //   this.postponedTodos -= 1;
  // }

  async completeById(id) {
    const todo = this.storage[id];
    todo.done();
    this.completedTodos += 1;
    const patch = {
      state: todo.state,
      dateCompleted: todo.dateCompleted,
    };
    return await patchTodo(id, patch);
  }

  // completeById(id) {
  //   const todo = this.storage[id];
  //   todo.done();
  //   this.completedTodos += 1;
  // }

  async deleteById(id, todo) {
    delete this.storage[id];
    this.todoCount -= 1;
    this.deletedTodos += 1;
    return await deleteTodo(id);
  }

  // deleteById(id) {
  //   delete this.storage[id];
  //   this.todoCount -= 1;
  //   this.deletedTodos += 1;
  // }

  // async function getAllTodo() {
  //   const allTodoResponse = await fetch(`${apiRoot}/todos/`);
  
  //   if (!allTodoResponse.ok) {
  //     console.log(`Error with status ${allTodoResponse.status}`);
  //     return;
  //   }
  
  //   console.log(`Ok with status ${allTodoResponse.status}`);
  
  //   return await allTodoResponse.json();
  // }

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
