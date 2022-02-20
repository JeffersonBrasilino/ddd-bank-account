import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Desafio Mutual')
    .setDescription(
      `<h4>Bem vindo!</h4>
                        <br>
                        <p>Esta é a documentação de uso das rotas da API do DESAFIO MUTUAL. 
                        Há alguns pontos a se considerar antes de começar o uso. sendo esses:</p>
                        <ul>
                            <li><strong>TODA</strong> requisição que necessite de body, o mesmo <strong>DEVE</strong> ter o formato <strong>JSON</strong></li>
                            <li><strong>TODO</strong> retorno de requisição tem o tipo <strong>JSON</strong></li>
                            <li>A API suporta os verbos <strong>GET, POST, PUT, DELETE</strong></li>
                            <li>Quando a rota não existir será retornado o <strong>código http 404</strong></li>
                        </ul>`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.API_PORT ?? 5000;
  await app.listen(port);
  console.log('rodando na porta ' + port);
}

bootstrap();
