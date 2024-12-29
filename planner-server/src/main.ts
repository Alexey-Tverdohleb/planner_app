import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

declare const module: any;

async function bootstrap() {
  const port = process.env.SERVER_DOCKER_PORT;

  const app = await NestFactory.create(AppModule);

  // Enable CORS so we can access the application from a different origin
  app.enableCors({
    origin: `http://localhost:${process.env.CLIENT_LOCAL_PORT}`,
  });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  // Start the application
  await app.listen(port).then((_value) => {
    console.log(`Server started at http://localhost:${port}`);
  });

  // This is necessary to make the hot-reload work with Docker
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
