- [Especificações](#especificações)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pre Requisitos](#pre-requisitos)
- [Instalação](#instalação)
  - [Sem Docker](#sem-docker)
  - [Com Docker](#com-docker)
- [Desenvolvendo](#desenvolvendo)
  - [ Generator](#-generator)
    - [CRUD Padrão](#crud-padrão)
    - [Entidade](#entidade)
    - [Migrações](#migrações)
    - [Testes](#testes)
- [Enviando para o git](#enviando-para-o-git)
- [Ajuda](#ajuda)

---

#### Especificações

- Nodejs 14.17.0
- Docker 20.10.7
- Docker compose 1.29.2
- NestJs 8.0.1
- Typescript 4.3.5
- TypeORM 0.2.34
- Jest 27.0.6

---

#### Estrutura do Projeto

O projeto tem a seguinte estrutura(os arquivos/pastas não especificados aqui não influenciará diretamente no desenvolvimento)

- app
  - **dist** - pasta que é gerada quando o projeto é buildado.
  - **documentation** - documentação para o uso do microserviço(experimental)
  - **node_modules** - pasta das dependencias node do projeto
  - **src** - toda a regra da aplicação se encontra aqui.
    - **applications** - pasta onde o dominio(regra de negócio) fica.
      - **applications.module.ts** - arquivo de registros de cada **dominio** na framework.
    - **core**: pasta do nucleo da aplicação
    - **infrastructure**: pasta de "detalhes de implementação"(orm, guarda de rotas, integrações...) do projeto.
      - **database**: pasta relacionada ao banco de dados bem como seu ORM
        - **contracts**: contratos(interfaces) que cada repositório deve implementar
          - **repository**: contratos de repositórios
          - **transactions**: contrato da transaction(em pausa)
          - **index.ts**: registro do IOC dos repositórios.
        * **typeorm**: pasta relacionada ao orm.
          - **connection**: pasta que contém o gerenciador de conexão customizado do orm
          - **core**: pasta que contem classes reusáveis para os repositórios e entidades
          - **entities**: pasta que contem as entidades e os repositorios de cada tabela do banco
          - **migrations**: pasta que contem as migrations do banco
      - **nats**
        - **client** - pasta que contém os arquivos de client(conexao com o nats-server)
        - **deserializer** - pasta que contem o decodificador de mensagem vinda do nats-server
        - **interceptors** - pasta que contem os interceptadores de resposta/requisição do nats
        - **serializer** - pasta que contem o codificador de mensagem do nats-server
  - **test** - teste e2e do projeto(creio que não funciona)
  - **-generator-x.x.x.tgz** - dependencia do gerador customizado do
  - **ormconfig.js** - arquivo de configuração da conexão com o banco de dados
  - **start-develop.sh** - arquivo de comandos que o compose develop usa para iniciar o projeto
  - **start-prod.sh** - arquivo de comandos que o compose prod usa para iniciar o projeto

* **.dockerignore:** arquivo docker responsável por especificar o que não sera copiado para dentro da imagem ao fazer o  
  build da imagem docker.
* .**env:** arquivo de configuração do container(porta entre outros)
* .gitignore: não precisa especificar.
* **docker-compose.develop.yml:** arquivo de configuração do docker compose responsavel por iniciar o container de **desenvolvimento**
* **docker-compose.prod.yml:** arquivo de configuração do docker compose responsavel por iniciar o container de **produção**
* docker-compose.yml: arquivo de configuração **geral** do docker compose.

Como explicado acima, todo o projeto se encontra dentro da pasta **app**. O projeto usa **clean architecture** com  
padrões de repositorio(repository pattern), serviço(service pattern), IOC(inversion of control) e outros.

---

#### Pré Requisitos

Para o microsserviço funcionar perfeitamente, é imprescindível que o **docker** esteja rodando.

O microserviço funciona em conjunto com **nats-server** e o serviço da **api-gateway**, pois sem o nats-server instalado, o serviço não se comunicará com os outros serviços e nem com a api-gateway, e sem a api-gateway o serviço não estará disponivel para o protocolo http(se o serviço for um serviço interno, desconsiderar esta parte).

Algumas funcionalidades deste serviço dependem de outros serviços sendo:

- Login - depende de:
  - serviço de email
  - serviço de pessoa
  - serviço de logs do sistema(não é obrigatório para dev)

---

#### Instalação

##### Sem docker

Para microserviços, a opção de instalação sem docker não rola.

##### Com docker

###### Desenvolvimento

- Clonar o projeto
- dentro da pasta do projeto, haverá um arquivo de configuração de exemplo(.env_example) copiar e renomear o arquivo para .env, ajustar as variáveis do arquivo(peça a seu coleguinha do lado).
- dentro da pasta _app_ há o arquivo de configuração do banco (ormconfig.js), peça a seu coleguinha do lado as credenciais do banco de dados e substitua as variaveis de ambiente(proccess.env) pelas credenciais que o carinha legal lhe passou. Esse passo difere da produção, pois para gerar migrations, entidades do banco, é necessário que as credenciais do banco estejam direto neste arquivo. **mas atenção, use essa configuração somente no ambiente de desenvolvimento**
- Após esses passos acima, na raiz do projeto rode o comando `docker-compose -f docker-compose.develop.yml up`, o container em **desenvolvimento** iniciará.
- por padrão o hot-reload estará habilidado(só não sei pq o do shauan não funciona...)

###### Produção

- Clonar o projeto
- dentro da pasta do projeto, haverá um arquivo de configuração de exemplo(.env_example) copiar e renomear o arquivo para .env, ajustar as variáveis do arquivo(peça a seu coleguinha do lado).
- Após esses passos acima, na raiz do projeto rode o comando `docker-compose -f docker-compose.prod.yml up`, o container em **produção** iniciará.

Se tudo correr lindamente vc verá um log como esse:
`[Nest] 674  - 10/27/2021, 8:19:42 PM VERBOSE XXXXX-service iniciado.`

###### mas nem tudo são rosas

- se caso precise instalar uma dependencia(npm) será necessário recriar o container. pois o proprio container é  
  responsavel por instalar a dependencia, ou seja, execute o seu npm install ou registre a sua dependencia no  
  package.json, após isso execute o container novamente, ele instalará a dependencia novamente.
- há problemas em que quando se inicia o projeto no container, e por algum motivo, seja executado localmente(sem o  
  docker), a dependencia **bcrypt** dá pau (alguma coisa relacionada ao linux). Para resolver basta remover a mesma e  
  instalar novamente.

---

#### Desenvolvendo

_Aqui é onde a brincadeira começa..._
Cada regra de negócio funciona como se fosse uma mini aplicação, podendo ser alterada, movida de forma independente e sem muito custo. para cada mini aplicação temos a seguinte estrutura:

- **controller**: pasta onde fica o controller, o mesmo é responsável por receber a requisição, bem como verificar se esta na estrutura correta.
- **service**: pasta onde fica o arquivo de serviço, o mesmo é responsável por toda a **logica de negócio** comunicação com repository e etc...
- **dto**: pasta onde fica os arquivos DTO(Data Transfer Object), os mesmos são responsáveis por ditar a regra de validação junto com o controller.
- **tests**: pasta onde fica os testes da regra de negócio.
- **XXX.module.ts**: Arquivo que contem as importações do controller e do service para fins de importação e disponibilização da regra de negócio(para fazer a regra valer, basta importar esse arquivo no arquivo _applications.module.ts_ caso a regra esteja na raiz _applications_ ou no arquivo _.module.ts_ ao qual a regra pertence).

##### Generator

Para ajudar o coleguinha programador, foi desenvolvido um plugin gerador de código chamado ** generator** esse será nosso companheiro na hora de gerar um CRUD, entidade de banco.

###### CRUD padrão

Para gerar um CRUD padrão ou a estrutura de código para uma regra de negócio mais complexa, basta usar: `npm run generate:endpoint`, fornecer o _nome_ e o _caminho_(caso se trate de uma regra que pertence a outra regra) e pronto, a estrutura ou CRUD está gerada conforme descrito acima.

Até aqui blza, mas como dizemos ao CRUD/regra em qual tabela deve-se persistir os dados?
Simples meu declarador de variáveis com acento, no arquivo _.service_ do seu CRUD/regra de negócio:

```typescript
constructor(private repo) {
    super(repo);
}
```

substitua por:

```typescript
constructor(@Inject('CHAVE_IOC_REPOSITORY') private repo:[INTERFACE_REPOSITORY]) {
    super(repo);
}
```

onde:

- CHAVE_IOC_REPOSITORY - chave que corresponde a classe, a mesma é declarada no arquivo _infrastructure/database/contracts/repository/index.ts_, na chave _provide_ de cada declaração de RepositoryProvider (IOC sacas...)
- INTERFACE_REPOSITORY a interface que o repositório implementa.

No arquivo _.module.ts_ do CRUD/regra:

```typescript
@Module({
   controllers: [ApiRoutesController],
   providers: [ApiRoutesService],
   exports: [ApiRoutesService]
})
```

na chave **providers** adicione o nome da contante criada no arquivo _infrastructure/database/contracts/repository/index.ts_.

Logo abaixo há a explicação de como gerar uma entidade, repository e o IOC.

Caso se trate de um CRUD, fazendo somente a importação do respositório ao qual o CRUD pertence, já temos um CRUD 100% funcional, não havendo necessidade de nenhuma outra regra de negocio.

Caso se trate de uma regra CUSTOMIZADA o mesmo serve de modelo para o desenvolvimento da regra.

###### Entidade

Para gerar uma entidade, basta usar: `npm run generate:entity`, fornecer o nome(camel_case) e pronto, a estrutura de entidade já está criada.

Para toda entidade:

- os campos padrões de: ID, STATUS, CREATED_AT, DELETED_AT, UPDATED_AT, estão em uma classe herdada(base-entity.ts) não havendo a necessidade de criar esses campos na entidade gerada.
- sempre quando se gera uma entidade, também é gerado um arquivo _.repository_, este arquivo conterá **todas as querys** relacionada a entidade. Então vc meu programador de HTML, não invente de colocar as querys no arquivo _.entity_.
- É gerado também o _contrato_ desse repositório(interface), ele se encontra na pasta: _infrastructure/database/contracts/repository_. então toda função de consulta feita no arquivo de repositório da entidade não esqueça de registrar ele na interface.

Para registrar o repositório na aplicação, basta adicionar no arquivo _infrastructure/database/contracts/repository/index.ts_:

```typescript
export const [NOME]RepositoryProvider: Provider = {
   provide: 'I[NOME]Repository',
   useClass: [NOME]Repository
}
```

onde:

- NOME_DO_REPO - nome do repositório/entidade gerada
  Por padrão, a chave `provide` deve ser o nome da interface, pois é mais fácil usar e saber qual repositório está sendo usado.

A parte da importação/uso do repositório/entidade está [aqui](#crud-padrão)

##### Migrações

Até agora, geramos os models no projeto, nenhuma tabela relacionada a eles foi gerada no banco, para isso existe o comando  
`npm run migration:generate --name=[NOME DA MIGRATION]` que gera um arquivo de migração.  
toda alteração nas entities relacionada as tabelas precisará gerar uma migração, pois assim teremos como controlar as alterações de estrutura do banco.

Para executar a migração é necessário parar a execução do container e iniciá-lo novamente, o comando de execução de migração executará assim que o container for iniciado.

##### Testes

Após a conclusão da regra, deveremos testar para assegurar que tudo funciona. O gerador de crud gera um arquivo padrão de testes, mas por se tratar de regras singulares, o mesmo deve ser alterado para testar sua solução corretamente. por padrão o projeto usa o jest para realizar tais testes e após a conclusão da alteração do arquivo, basta rodar o comando `npm run test --module=[CAMINHO_MODULO]` que o jest irá testar. por padrão o arquivo de testes conta com um mock das funções do repositório(banco de dados) para não poluir a base, é recomendado o uso do mock.

##### Enviando para o git

Após toda a labuta feita, todos os testes realizados, é hora de upar seu código para o git.

Antes de tudo, execute o comando(dentro da pasta app) `npm run prepare-husky`, este comando ativará os ganchos de commit e em decorrencia analisará toda a qualidade do seu commit. **ESTE PASSO É OBRIGATÓRIO**

Para atualizar, Há um fluxo a ser seguido sendo:
![flow-git](./.gitlab/images/git-flow.drawio.png)

existe 3 **AMBIENTES** sendo:

- dev: _ambiente de desenvolvimento, exclusivo para testes internos, desenvolvimento do front_.
- homologacao: _ambiente de validações das alterações(bug, features...)_
- prod(main): _ambiente de produção._

Para cada nova funcionalidade, correção ou mudança de request deve ser criado uma branch com base na branch **MAIN**, realizar a tarefa, commitar e concluir a tarefa.
A nomenclatura de cada branch deve seguir determinado padrão, sendo:

- **bug**: para ajustes
- **feature**: para novas funcionalidades.

O nome deve seguir o tipo de tarefa/codigo da tarefa. Ex: bug/#32 ou feature/#9999. As branchs de atividades PODEM e DEVEM ser feito merge com a branch de **dev**, pois esta branch é que os frontends usam para desenvolver as telas.

Para os ambientes de **HOMO** e **PROD(main)** haverá uma branch para cada nomeada com a referencia da sprint. deve ser aberto um MERGE REQUEST da branch do ajuste para a branch da SRPINT. Para as atualizações destes ambientes, seguimos um cronograma:

- **HOMO**: 10 dias antes do final da sprint.
- **PROD**: 5 após o final da sprint.

Então as atividades realizadas e concluídas até o décimo dia de sprint serão adicionadas para os clientes testarem e posteriormente irão para o ambiente de produção.

**ATENÇÃO**: Ao realizar o merge das atividades com o ambiente de **DEV**, desmarcar a caixa de **DELETE BRANCH AFTER MERGE**, esta flag deletará a branch assim que o merge for concluído com o ambiente de dev, fazendo assim toda a sua atividade ficar inutil, pois a mesma também será feito o merge com o PROD e o HOMO.

Após o merge request do ajuste ser mesclado com o ambiente PROD(main), o mesmo será **DELETADO!** pois a linha final do desenvolvimento do ajuste é o ambiente de PROD.
Alterações no ambiente de **HOMOLOGAÇÃO SEM APROVAÇÃO** não serão mescladas ao ambiente de PROD. deverá ser aberto um outro merge request da branch do ajuste a branch da nova sprint.

##### Ajuda

Achou mesmo que ia te ajudar? eis aqui quem pode te dar uma força:

- nestjs - https://docs.nestjs.com/
- typeORM - https://typeorm.io/#/
- jest - https://jestjs.io/pt-BR/

Boa sorte no seu desenvolvimento meu atribulado, meu criador de tabelas de banco de dados sem normalização, meu declarador de funções recursivas sem gatilho de break, meu declarador de try sem catch.
