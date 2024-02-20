import UserController from './Controller/UserController';
import App from './app';

const app = new App([
  new UserController(),
]);

app.listen(3333);
