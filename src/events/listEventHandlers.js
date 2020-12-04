import { getTodoInput } from "../helpers.js";

import todoStorage from "../model/todoStorage.js";
import renderTodoList from "../view/todoListPage/todoList.js";
import renderTodoPage from "../view/todoPage/todoPage.js";

function addTodoHandler(doc) {
  console.log("Add button clicked");
  const todoTextInput = getTodoInput(doc);
  todoStorage.createTodo(todoTextInput.value);

  const todoItemCreated = new Event("todo-item-created");
  doc.dispatchEvent(todoItemCreated);
}

function clearFormHandler(doc) {
  console.log("Clear button clicked");
  const todoTextInput = getTodoInput(doc);
  todoTextInput.value = "";
}

function updateTotalTodoCount(doc) {
  console.log("Updating Total Todo Count");

  const h2 = doc.getElementById("total-counter-number");
  h2.innerHTML = `${todoStorage.totalTodoCount()}`;
}

function updateTodoList(doc) {
  console.log("Updating Todo List");

  const allTodo = todoStorage.getAllTodo();
  renderTodoList(doc, allTodo);
}

function renderTodo(doc, event) {
  const todoId = event.detail.todoId;
  console.log(`Rendering todo screen for todo: ${todoId}`);
  renderTodoPage(doc, todoStorage.getTodoById(todoId));
}

function notifyAboutTodoChange(doc) {
  const todoItemChanged = new Event("todo-item-changed");
  doc.dispatchEvent(todoItemChanged);
}

function notifyAboutDeletedTodo(doc) {
  const todoItemDeleted = new Event("todo-item-deleted");
  doc.dispatchEvent(todoItemDeleted);
}

function notifyAboutTodoView(doc, todoId) {
  const todoItemShown = new CustomEvent("todo-item-shown", {
    detail: { todoId },
  });
  doc.dispatchEvent(todoItemShown);
}

function todoListActionHandler(doc, event) {
  const actionName = event.target.dataset["action"];
  const todoId = event.target.dataset["id"];

  switch (actionName) {
    case "view":
      console.log(`Processing view action for id: ${todoId}`);
      notifyAboutTodoView(doc, todoId);
      break;
    case "postpone":
      console.log(`Processing postpone action for id: ${todoId}`);
      todoStorage.postponeById(todoId);
      notifyAboutTodoChange(doc);
      break;
    case "resume":
      console.log(`Processing resume action for id: ${todoId}`);
      todoStorage.resumeById(todoId);
      notifyAboutTodoChange(doc);
      break;
    case "done":
      console.log(`Processing done action for id: ${todoId}`);
      todoStorage.completeById(todoId);
      notifyAboutTodoChange(doc);
      break;
    case "delete":
      console.log(`Processing delete action for id: ${todoId}`);
      todoStorage.deleteById(todoId);
      notifyAboutDeletedTodo(doc);
      break;

    default:
      console.log("Panic! Unknown Action.");
  }
}

export function getListEventHandlers(doc) {
  return [
    {
      elementId: "add-todo-button",
      eventName: "click",
      handler: addTodoHandler.bind(null, doc),
    },
    {
      elementId: "clear-form-button",
      eventName: "click",
      handler: clearFormHandler.bind(null, doc),
    },
    {
      elementId: "todo-list",
      eventName: "click",
      handler: todoListActionHandler.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-created",
      handler: updateTotalTodoCount.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-created",
      handler: updateTodoList.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-created",
      handler: clearFormHandler.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-changed",
      handler: updateTodoList.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-deleted",
      handler: updateTotalTodoCount.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-deleted",
      handler: updateTodoList.bind(null, doc),
    },
    {
      element: doc,
      eventName: "todo-item-shown",
      handler: renderTodo.bind(null, doc),
    },
  ];
}