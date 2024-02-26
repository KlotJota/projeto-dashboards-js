import { NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import Task, { TaskInterface } from '../schemas/Task';
import UserContainTaskException from '../errors/UserContainTaskException';

class UserSevice {
  public async validateExistAnyTask(id: string, next: NextFunction): Promise<boolean> {
    const tasks = await Task.exists({ responsible: { _id: id } });

    if (tasks) {
      next(new UserContainTaskException());
      return true;
    }

    return false;
  }
}

export default new UserSevice();
