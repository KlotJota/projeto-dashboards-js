import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Controller from './Controller/Controller';

class App {
public app: express.Application;

public constructor(controllers: Controller[]) {
  this.app = express();
  this.app.use(cors());

  this.initMongoose();
  this.connectDataBase();
  this.initExpressJson();
  this.initController(controllers);
}

// Inicia o BD
private initMongoose(): void {
  mongoose.set('runValidators', true);
}

// Conecta ao BD
private connectDataBase(): void {
  mongoose.connect('mongodb+srv://JonathanCrazy:NDalkWBJYxZ8IZeP@clusterjavascript1.jz1wwbx.mongodb.net/projeto-dashboards-javascript?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

private initExpressJson(): void {
  this.app.use(express.json());
}

private initController(controllers: Controller[]): void {
  controllers.forEach((controller) => {
    this.app.use('/', controller.router);
  });
}

public listen(port: number): void {
  this.app.listen(port, () => {
    console.log(`Aplicação iniciada na porta: ${port}`);
  });
}
}

export default App;
