/* eslint-disable prefer-destructuring */
import { Subject } from 'rxjs';
import {
  scan,
  share,
  startWith,
} from 'rxjs/operators';
import Actions from './actions';
import reduce from './reduce';

export default class Store {
  constructor(data) {
    this.data = data;
    this.actions$ = new Subject();
    this.state$ = this.actions$.asObservable().pipe(
      startWith({ type: '__INITIALIZATION__' }),
      scan((state, action) => reduce(state, action),
        {
          projects: this.data.projects,
          selected: this.data.projects[0],
        }),
      share(),
    );
  }

  dispatch(type, payload) {
    this.actions$.next({ type, payload });
  }

  changeStatus(id) {
    this.dispatch(Actions.ChangeStatus, id);
  }

  changeProject(id) {
    this.dispatch(Actions.ChangeProject, id);
  }
}
