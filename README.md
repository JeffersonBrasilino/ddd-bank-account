- [Especificações](#especificações)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pre Requisitos](#pre-requisitos)
- [Instalação](#instalação)

---

#### Especificações

- Nodejs 14.18
- Docker 20.10.12
- Docker compose 1.29.2
- NestJs 8.2.0
- Typescript 4.3.5
- Jest 27.0.6

---

#### Pré Requisitos

Para o projeto funcionar perfeitamente, é imprescindível que o **docker** e o **docker-compose** estejam instalados e rodando.

#### Instalação

##### configuração
- A configuração de variaveis do projeto(porta que a api ira rodar, credenciais do banco) ficam dentro do arquivo **.env**. ha um exemplo do arquivo chamado ***.env_example**, como se trata somente de um desafio, deixei toda a configuração padrão para DOCKER configurada. basta somente renomear o arquivo **.env_example** para **.env**.

- rodar somente o comando `docker-compose up`

  Em alguns casos pode ocorrer o seguinte problema: ``standard_init_linux.go:190: exec user process caused "no such file or directory``, isso ocorre por causa da quebra linha (EOF) do arquivo `start.sh`. [solucao aqui](https://stackoverflow.com/questions/51508150/standard-init-linux-go190-exec-user-process-caused-no-such-file-or-directory)

#### Documentação

Assim que o projeto estiver rodando, basta acessar o endpoint **/docs**. Ex: http://localhost:3000/docs.

#### Testes
para realizar os testes do projeto, basta rodar o comando ```npx jest```, para visualizar a cobertura dos testes basta rodar ```npx jest --coverage```
