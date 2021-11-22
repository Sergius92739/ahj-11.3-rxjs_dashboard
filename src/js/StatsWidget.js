export default class StatsWidget {
  constructor() {
    this.container = null;
    this.projectList = null;
    this.quantity = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.container.insertAdjacentHTML('afterbegin', StatsWidget.markUp);
    this.projectList = document.getElementById('stats_list');
  }

  getMarkUp(project) {
    this.quantity = project.tasks.filter((elem) => !elem.done).length;
    return `<tr class="widget__row" data-id="${project.id}">
    <td class="widget-row__title">${project.name}</td>
    <td class="widget-row__count"><span class="count" data-count_id="${project.id}">${this.quantity}</span></td>
  </tr>`;
  }

  drawProjects(state) {
    this.projectList.innerHTML = '';
    state.projects
      .forEach((project) => {
        this.projectList.insertAdjacentHTML('beforeend', this.getMarkUp(project));
      });
  }

  static get markUp() {
    return `<table class="widget">
    <caption class="widget__title">Stats</caption>
    <thead class="widget__thead">
      <tr class="widget__row">
        <th class="widget-row__title">Project</th>
        <th class="widget-row__count">Open</th>
      </tr>
    </thead>
    <tbody class="widget__tbody" id="stats_list"></tbody>
  </table>`;
  }
}
