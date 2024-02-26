import TaskController from './Controller/TaskController';
import UserController from './Controller/UserController';
import App from './app';

const app = new App([
  new UserController(),
  new TaskController(),
]);

app.listen(3333);
