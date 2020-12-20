import { createElement, clearRootElement } from "../helpers.js";

import { getTodoEventHandlers } from "../events/todoEventHandlers.js";
import { setupEventListeners } from "../events.js";

import configureRouter from "../routerConfig.js";
import todoStorage from "../model/todoStorage.js";

export default function renderStatisticsPage(doc) {
  const rootElement = clearRootElement(doc);
  const appContainer = createElement(doc, "div", "stat-container");
  const statBlock = createElement(doc, "div", "stat-block");
  statBlock.id = "stat";

  const statItemDone = createElement(doc, "div", "stat-item-done");
  const statItemPostponed = createElement(doc, "div", "stat-item-postponed");
  const statItemDeleted = createElement(doc, "div", "stat-item-deleted");

  const postponedTodos = createElement(doc, "div", "postponed");
  postponedTodos.innerHTML = `Total Todo postponed: ${todoStorage.postponedTodos}`;

  const completedTodos = createElement(doc, "div", "done");
  completedTodos.innerHTML = `Total Todo done: ${todoStorage.completedTodos}`;

  const deletedTodos = createElement(doc, "div", "deleted");
  deletedTodos.innerHTML = `Total Todo deleted: ${todoStorage.deletedTodos}`;

  const backBtn = createElement(doc, "button", "back-to-todo-button");
  backBtn.innerHTML = "Back to list";
  backBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const router = configureRouter(doc, "/");
    router.navigate("/");
  });
  
  rootElement.append(appContainer);
  appContainer.append(statBlock);
  statBlock.append(statItemDone, statItemPostponed, statItemDeleted);
  statItemPostponed.append(postponedTodos);
  statItemDone.append(completedTodos);
  statItemDeleted.append(deletedTodos);
  appContainer.append(backBtn);

  setupEventListeners(doc, getTodoEventHandlers(doc));
};
