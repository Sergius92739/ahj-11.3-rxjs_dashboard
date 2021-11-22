import { fromEvent, pluck } from 'rxjs';

export default class TaskWidget {
  constructor(store) {
    this.store = store;
    this.container = null;
    this.taskList = null;
    this.menuList = null;
    this.selectedProject = null;
    this.menu = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.container.insertAdjacentHTML('beforeend', TaskWidget.markUp);
    this.taskList = document.getElementById('task_list');
    this.menu = document.querySelector('.widget__menu');
    this.menuList = document.querySelector('.widget-menu__list');
    this.selectedProject = document.querySelector('.widget-row__link');
    this.selectedProject.addEventListener('click', () => {
      this.menu.classList.remove('visually_hidden');
    });
  }

  static getTaskMarkUp(task) {
    return `<tr class="widget__row" data-id="${task.id}">
    <td class="widget-row__btn"><button class="check__btn checked"></button></td>
    <td class="widget-row__task">${task.name}</td>
  </tr>`;
  }

  drawTasks(state) {
    this.menu.classList.add('visually_hidden');
    this.drawMenu(state);
    this.drawSelectedProject(state);
    this.drawTaskList(state);
  }

  drawSelectedProject(state) {
    this.selectedProject.textContent = state.selected.name;
  }

  drawTaskList(state) {
    this.taskList.innerHTML = '';
    state.selected.tasks.forEach((task) => {
      this.taskList.insertAdjacentHTML(
        'beforeend',
        `<tr class="widget__row" data-id="${task.id}">
        <td class="widget-row__btn"><button class="check__btn" data-id="${task.id}"></button></td>
        <td class="widget-row__task">${task.name}</td>
      </tr>`,
      );
      if (task.done) {
        document.querySelector(`.check__btn[data-id="${task.id}"]`).classList.add('checked');
      }
    });
    [...document.querySelectorAll('.check__btn')]
      .forEach((checkbox) => {
        fromEvent(checkbox, 'click')
          .pipe(
            pluck('target', 'dataset', 'id'),
          )
          .subscribe((id) => this.store.changeStatus(+id));
      });
  }

  drawMenu(state) {
    this.menuList.innerHTML = '';
    this.menuList
      .insertAdjacentHTML(
        'afterbegin',
        `<li class="widget-menu__item checked" data-id="${state.selected.id}">${state.selected.name}</li>`,
      );

    state.projects
      .filter((project) => project.id !== state.selected.id)
      .forEach((project) => {
        this.menuList
          .insertAdjacentHTML(
            'beforeend',
            `<li class="widget-menu__item" data-id="${project.id}">${project.name}</li>`,
          );
      });
    [...document.querySelectorAll('.widget-menu__item')]
      .forEach((element) => {
        fromEvent(element, 'click')
          .pipe(
            pluck('target', 'dataset', 'id'),
          )
          .subscribe((id) => this.store.changeProject(+id));
      });
  }

  static get markUp() {
    return `<div class="tasks__widget">
    <div class="widget__menu visually_hidden">
      <div class="widget-menu__title">Project:</div>
      <ul class="widget-menu__list"></ul>
    </div>
    <table class="widget" id="tasks">
      <caption class="widget__title">Tasks</caption>
      <thead class="widget__thead">
        <tr class="widget__row">
          <th class="widget-row__text" colspan="2">Project:<span class="widget-row__link"></span></th>
        </tr>
      </thead>
      <tbody class="widget__tbody" id="task_list"></tbody>
    </table>
  </div>`;
  }
}
