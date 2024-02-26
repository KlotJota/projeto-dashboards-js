import { NextFunction, Request, Response } from 'express';
import Controller from './Controller';
import ValidationService from '../services/ValidationService';
import ServerErrorException from '../errors/ServerErrorException';
import NotFoundException from '../errors/NotFoundEXception';
import responseCreate from '../responses/ResponseCreate';
import responseOk from '../responses/ResponseOk';
import NoContentException from '../errors/NoContentException';
import Task, { TaskInterface } from '../schemas/Task';
import TaskService from '../services/TaskService';

class TaskController extends Controller {
  constructor() {
    super('/task');
  }

  protected initRoutes(): void {
    this.router.get(`${this.path}/:filter/:_id`, this.list);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.edit);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const tasks = await Task.find(TaskService.getParamsList(req)).populate('responsible');

      if (tasks.length) return responseOk(res, tasks);

      next(new NoContentException());
      return res;
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }

  private async findById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return res; // Adiciona "return" vazio aqui

      const task = await Task.findById(id);
      if (task) return responseOk(res, task);
      next(new NoContentException());
      return res;
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      let task: TaskInterface = req.body;

      TaskService.checkStatusFinished(task);
      task = await Task.create(task);
      const foundTask = await Task.findById(task.id).populate('responsible');

      task = foundTask || task;

      return responseCreate(res, task);
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }

  private async edit(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { id } = req.params;
      if (ValidationService.validateId(id, next)) return res;

      let task: TaskInterface = req.body;
      TaskService.checkStatusFinished(task);

      const updatedTask = await Task.findByIdAndUpdate(id, task);
      task = updatedTask || task;

      if (task) {
        const foundTask = await Task.findById(task.id).populate('responsible');

        task = foundTask || task;
        return responseOk(res, task);
      }
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
      if (ValidationService.validateId(id, next)) return res; // caso id nao existe, para a execução

      const task = await Task.findById(id);

      if (!task) {
        next(new NotFoundException());
        return res;
      }

      await task.deleteOne();
      return responseOk(res, task);
    } catch (error) {
      next(new ServerErrorException(error));
      return res;
    }
  }
}

export default TaskController;
