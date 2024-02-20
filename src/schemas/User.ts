import { model, Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
    name: string,
    email: string,
    password: string,
    creation: Date
}

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Nome obrigatório'], // declaramos se é ou não necessario e deixamos uma msg de aviso
  },
  email: {
    type: String,
    required: [true, 'E-mail obrigatório'],
    unique: true,
    lowercase: true, // transforma quaisquer caracter maiusculo em minusculo
  },
  password: {
    type: String,
    required: [true, 'Senha obrigatória'],
    select: false, // por segurança, ao fazermos select nos dados de user, a senha não virá junto
  },
  creation: {
    type: Date,
    default: Date.now, // recebe automaticamente a data atual
  },
});

export default model<UserInterface>('User', UserSchema); // importo esse modelo para que fique visivel para o projeto
