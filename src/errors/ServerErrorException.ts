import HttpStatusCode from '../responses/HttpStatusCode';
import HttpException from './HttpException';

class ServerErrorException extends HttpException {
  constructor(error) {
    super(getStatus(error), getMessage(error));
  }
}

function getStatus(error): number {
  if (isMongoException(error)) return HttpStatusCode.BAD_REQUEST;
  return HttpStatusCode.INTERNAL_SERVER_ERROR;
}

function isMongoException(error): boolean {
  if (isMongoError(error) || isValidationError(error)) return true;
  return false;
}

function isMongoError(error): boolean {
  return error.name === 'MongoError';
}

function isValidationError(error): boolean {
  return error.name === 'ValidationError';
}

function getMessage(error: any): string {
  try {
    if (isMongoException(error)) {
      if (isKeyUniqueError(error)) return getMessageKeyUnique(error);
      if (isValidationError(error)) return getMessageValidationError(error);
    } else {
      return getMessageGeneric();
    }
  } catch (error) {
    return getMessageGeneric();
  }

  // Se nenhum dos casos acima for correspondido, retorne uma mensagem genérica
  return getMessageGeneric();
}

function isKeyUniqueError(error) {
  return isMongoError(error) && error.code === 11000;
}

function getMessageKeyUnique(error: any): string {
  const { keyPattern } = error;

  const listFormattedErrors = Object.keys(keyPattern).map((field) => `${field} deve ser único`);

  return listFormattedErrors.join(' | ');
}

interface ValidationError {
    message: string;
  }

  interface ErrorObject {
    [key: string]: ValidationError;
  }

function getMessageValidationError(error: any): string {
  const { errors } = error as { errors: ErrorObject };

  const listFormattedErrors = Object.keys(errors).map((field) => errors[field].message);

  return listFormattedErrors.join(' | ');
}

function getMessageGeneric(): string {
  return 'Erro interno no servidor.';
}

export default ServerErrorException;
