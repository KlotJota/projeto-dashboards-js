import { NextFunction, Request, Response } from 'express';
import Controller from './Controller';
import User from '../schemas/User';
import ValidationService from '../services/ValidationService';
import ServerErrorException from '../errors/ServerErrorException';
import NotFoundException from '../errors/NotFoundEXception';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
import NoContentException from '../errors/NoContentException';

class UserController extends Controller {
  constructor() {
    super('/user');
  }

  protected initRoutes(): void {
    this.router.get(this.path, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const users = await User.find();

      if (users.length) {
        return responseOk(res, users);
      }
      next(new NoContentException());
      return res; // Retornar res diretamente
    } catch (error) {
      next(new ServerErrorException(error));
      return res; // Retornar res diretamente
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return res; // Adiciona "return" vazio aqui

      const user = await User.findById(id);
      if (user) return responseOk(res, user);
      next(new NoContentException());
      return res;
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const user = await User.create(req.body);

      return responseCreate(res, user);
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return res;

      const user = await User.findByIdAndUpdate(id, req.body).exec();

      if (user) return responseOk(res, user);

      next(new NoContentException());
      return res;
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }

  private async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return res;

      const user = await User.findById(id);

      if (!user) {
        next(new NotFoundException());
        return res;
      }

      await user.deleteOne();
      return responseOk(res, user);
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }
}

export default UserController;
