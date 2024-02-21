import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class NotFoundException extends HttpException {
  constructor() {
    super(HttpStatusCode.NOT_FOUND, 'Registro não encontrado');
  }
}

export default NotFoundException;
