import { model, Schema, Document } from 'mongoose';
import { UserInterface } from './User';

export enum StatusEnum {
    OPEN = 'OPEN',
    FINISHED = 'FINISHED'
}

export interface TaskInterface extends Document {
    description: string,
    status: StatusEnum,
    concluded: Date,
    responsible: UserInterface, // uma tarefa terá um usuário relacionado
    creation: Date
}

const TaskSchema = new Schema({
  description: {
    type: String,
    required: [true, 'Descrição obrigatória'], // declaramos se é ou não necessario e deixamos uma msg de aviso
  },
  status: {
    type: String,
    validate: {
      validator: (value) => {
        if (value === StatusEnum.OPEN || value === StatusEnum.FINISHED) return true;
      },
      message: (props) => `${props.value} não é um status válido.`,
    },
    required: [true, 'Status obrigatório'],
    uppercase: true, // transforma quaisquer caracter maiusculo em minusculo
  },
  concluded: {
    type: Date,
  },
  responsible: {
    type: Schema.Types.ObjectId,
    ref: 'User', // mesma referencia em UserSchema
    required: [true, 'Reponsável obrigatório'],
  },
  creation: {
    type: Date,
    default: Date.now, // recebe automaticamente a data atual
  },
});

export default model<TaskInterface>('Task', TaskSchema); // importo esse modelo para que fique visivel para o projeto
