import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class IdInvalidException extends HttpException {
  constructor() {
    super(HttpStatusCode.BAD_REQUEST, 'Id inválido, verifique novamente');
  }
}

export default IdInvalidException;
