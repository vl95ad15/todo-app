/* eslint-disable import/prefer-default-export */

import { getTodoInput } from "../helpers.js";

import todoStorage from "../model/todoStorage.js";
import renderTodoList from "../view/todoListPage/todoList.js";

import configureRouter from "../routerConfig.js";

async function addTodoHandler(doc) {
  console.log("Add button clicked");
  const todoTextInput = getTodoInput(doc);
  await todoStorage.createTodo(todoTextInput.value);

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

async function updateTodoList(doc) {
  console.log("Updating Todo List");

  const allTodo = await todoStorage.getAllTodo();
  renderTodoList(doc, allTodo);
}

function navigateToTodo(doc, event) {
  const todoId = event.detail.todoId;
  console.log(`Rendering todo screen for todo: ${todoId}`);

  const router = configureRouter(doc, "/");
  router.navigate(`todo/${todoId}`);
}

function navigateToStatistics(doc) {
  console.log(`Rendering todo screen for statistics`);
  const router = configureRouter(doc, "/");
  router.navigate(`statistics`);
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

async function todoListActionHandler(doc, event) {
  const actionName = event.target.dataset["action"];
  const todoId = event.target.dataset["id"];

  switch (actionName) {
    case "view":
      console.log(`Processing view action for id: ${todoId}`);
      notifyAboutTodoView(doc, todoId);
      break;
    case "postpone":
      console.log(`Processing postpone action for id: ${todoId}`);
      await todoStorage.postponeById(todoId);
      notifyAboutTodoChange(doc);
      break;
    case "resume":
      console.log(`Processing resume action for id: ${todoId}`);
      await todoStorage.resumeById(todoId);
      notifyAboutTodoChange(doc);
      break;
    case "done":
      console.log(`Processing done action for id: ${todoId}`);
      await todoStorage.completeById(todoId);
      notifyAboutTodoChange(doc);
      break;
    case "delete":
      console.log(`Processing delete action for id: ${todoId}`);
      await todoStorage.deleteById(todoId);
      notifyAboutDeletedTodo(doc);
      break;

    default:
      console.log("Panic! Unknown Action.");
  }
}

let boundAddTodoHandler = null;
let boundClearFormHandler = null;
let boundTodoListActionHandler = null;
let boundUpdateTotalTodoCount = null;
let boundUpdateTodoList = null;
let boundClearFormHandlerTodoItemCreated = null;
let boundUpdateTodoListTodoItemChanged = null;
let boundUpdateTotalTodoCountTodoItemDeleted = null;
let boundUpdateTodoListTodoItemDeleted = null;
let boundNavigateToTodo = null;
let boundNavigateToStatistics = null;

export function getListEventHandlers(doc) {
  boundAddTodoHandler = boundAddTodoHandler !== null ? boundAddTodoHandler : addTodoHandler.bind(null, doc);

  boundClearFormHandler = boundClearFormHandler !== null ? boundClearFormHandler : clearFormHandler.bind(null, doc);

  boundTodoListActionHandler = boundTodoListActionHandler !== null ? boundTodoListActionHandler : todoListActionHandler.bind(null, doc);

  boundUpdateTotalTodoCount = boundUpdateTotalTodoCount !== null ? boundUpdateTotalTodoCount : updateTotalTodoCount.bind(null, doc);

  boundUpdateTodoList = boundUpdateTodoList !== null ? boundUpdateTodoList : updateTodoList.bind(null, doc);

  boundClearFormHandlerTodoItemCreated = boundClearFormHandlerTodoItemCreated !== null ? boundClearFormHandlerTodoItemCreated : clearFormHandler.bind(null, doc);

  boundUpdateTodoListTodoItemChanged = boundUpdateTodoListTodoItemChanged !== null ? boundUpdateTodoListTodoItemChanged : updateTodoList.bind(null, doc);

  boundUpdateTotalTodoCountTodoItemDeleted = boundUpdateTotalTodoCountTodoItemDeleted !== null ? boundUpdateTotalTodoCountTodoItemDeleted : updateTotalTodoCount.bind(null, doc);

  boundUpdateTodoListTodoItemDeleted = boundUpdateTodoListTodoItemDeleted !== null ? boundUpdateTodoListTodoItemDeleted : updateTodoList.bind(null, doc);

  boundNavigateToTodo = boundNavigateToTodo !== null ? boundNavigateToTodo : navigateToTodo.bind(null, doc);

  boundNavigateToStatistics = boundNavigateToStatistics !== null ? boundNavigateToStatistics : navigateToStatistics.bind(null, doc);

  return [
    {
      elementId: "add-todo-button",
      eventName: "click",
      handler: boundAddTodoHandler,
    },
    {
      elementId: "clear-form-button",
      eventName: "click",
      handler: boundClearFormHandler,
    },
    {
      elementId: "todo-list",
      eventName: "click",
      handler: boundTodoListActionHandler,
    },
    {
      elementId: "stat-button",
      eventName: "click",
      handler: boundNavigateToStatistics,
    },
    {
      element: doc,
      eventName: "todo-item-created",
      handler: boundUpdateTotalTodoCount,
    },
    {
      element: doc,
      eventName: "todo-item-created",
      handler: boundUpdateTodoList,
    },
    {
      element: doc,
      eventName: "todo-item-created",
      handler: boundClearFormHandlerTodoItemCreated,
    },
    {
      element: doc,
      eventName: "todo-item-changed",
      handler: boundUpdateTodoListTodoItemChanged,
    },
    {
      element: doc,
      eventName: "todo-item-deleted",
      handler: boundUpdateTotalTodoCountTodoItemDeleted,
    },
    {
      element: doc,
      eventName: "todo-item-deleted",
      handler: boundUpdateTodoListTodoItemDeleted,
    },
    {
      element: doc,
      eventName: "todo-item-shown",
      handler: boundNavigateToTodo,
    },
  ];
}