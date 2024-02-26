import TaskController from './Controller/TaskController';
import UserController from './Controller/UserController';
import App from './app';
import DashController from './Controller/DashController';

const app = new App([
  new UserController(),
  new TaskController(),
  new DashController(),
]);

app.listen(3333);
