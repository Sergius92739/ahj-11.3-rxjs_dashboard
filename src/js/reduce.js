import Actions from './actions';

export default function reduce(state, action) {
  switch (action.type) {
    case Actions.ChangeStatus: {
      const task = state.selected.tasks
        .find((elem) => elem.id === action.payload);
      task.done = !task.done;
      return state;
    }
    case Actions.ChangeProject: {
      const project = state.projects
        .find((elem) => elem.id === action.payload);
      return {
        projects: state.projects,
        selected: project,
      };
    }
    default:
      return state;
  }
}
