import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerDocumentation } from '@core/infrastructure/http/api-http-documentation/swagger-documentation';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const appEnvironment = app.get(ConfigService).get('app');

  const doc = new SwaggerDocumentation(app);
  doc.description = `<h4>Bem vindo!</h4>
                        <br>
                        <p>Esta é a documentação de uso das rotas da API do sw Mobile. 
                        Há alguns pontos a se considerar antes de começar o uso. sendo esses:</p>
                        <ul>
                            <li><strong>TODA</strong> requisição que necessite de body, o mesmo <strong>DEVE</strong> ter o formato <strong>JSON</strong></li>
                            <li><strong>TODO</strong> retorno de requisição tem o tipo <strong>JSON</strong></li>
                            <li>A API suporta os verbos <strong>GET, POST, PUT, DELETE</strong></li>
                            <li>A API usa autenticação do tipo <strong>BEARER</strong>, ou seja, <strong>TODA ROTA AUTENTICADA</strong> deve conter o <strong>TOKEN</strong> de autenticação no <strong>CABEÇALHO DA REQUISIÇÃO</strong>.</li>
                            <li>O <strong>TOKEN</strong> é gerado a partir do <strong>LOGIN</strong> na api, e tem validade de <strong>8 HORAS</strong>.</li>
                            <li>Quando a rota não existir será retornado o <strong>código http 404</strong></li>
                            <li>Quando a rota for <strong>AUTENTICADA</strong> mas não possuir o <strong>TOKEN</strong> de autenticação, será retornado o <strong>código http 401</strong></li>
                            <li>Quanto a rota for <strong>AUTENTICADA</strong>, conter o token mas o usuário/aplicação não possuir credenciais, será retornado o <strong>código http 403</strong></li>
                            <li>
                                Para rotas <strong>abertas</strong>(rotas que não necessitam de autenticação de usuário) ex: login, recovery password
                                deverá ser enviado um cabeçalho <code>app-auth-token</code>
                                com o token gerado fornecido.
                            </li>
                        </ul>
`;
  doc.generate(appEnvironment.docsUri);

  await app.listen(appEnvironment.port);
  console.log(
    `rodando no ambiente de ${appEnvironment.env} na porta ${appEnvironment.port}`,
  );
}
bootstrap();
