import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class UserContainTaskException extends HttpException {
  constructor() {
    super(HttpStatusCode.CONFLICT, 'Impossível deletar, usuários possui tarefas relacionadas');
  }
}

export default UserContainTaskException;
