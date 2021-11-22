import StatsWidget from './StatsWidget';
import Store from './Store';
import TaskWidget from './TasksWidget';

export default class AppController {
  constructor(data) {
    this.data = data;
    this.store = new Store(this.data);
    this.stats = new StatsWidget();
    this.tasks = new TaskWidget(this.store);
  }

  init() {
    this.stats.bindToDOM(document.querySelector('.container'));
    this.tasks.bindToDOM(document.querySelector('.container'));

    this.store.state$
      .subscribe((state) => {
        this.stats.drawProjects(state);
        this.tasks.drawTasks(state);
      });
  }
}
