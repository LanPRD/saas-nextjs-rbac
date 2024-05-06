# SaaS Monorepo Next.js/Node.js

## Next.js - Frontend

**Clique [aqui](link) para acessar a pasta referente ao projeto frontend.**

## Node.js - Backend

**Clique [aqui](./apps/api/) para acessar a pasta referente ao projeto backend.**

No backend, foi utilizado [Node.js](https://nodejs.org/docs/latest/api/) com o servidor [Fastify](https://fastify.dev/docs/latest/).

- Para a autenticação, foram utilizados [Fastify JWT](https://github.com/fastify/fastify-jwt) e [Bcrypt.js](https://www.npmjs.com/package/bcryptjs).
- O gerenciamento de roles foi tratado pelo [CASL](https://casl.js.org/v6/en/guide/intro).
- Para garantir a validação dos dados, foi implementado o [Zod](https://zod.dev/).
- A documentação foi feita com [Swagger](https://github.com/fastify/fastify-swagger) e [Swagger UI](https://github.com/fastify/fastify-swagger-ui).
- Foi utilizado o [Prisma](https://www.prisma.io/docs) como ORM para o banco de dados, optando pelo SQLite pela facilidade de configuração.
- Além disso, foi utilizado o [Faker.js](https://fakerjs.dev/guide/) para auxiliar nos testes.
- Todo o código foi escrito em [TypeScript](https://www.typescriptlang.org/docs/) para garantir uma base sólida e tipada.

## Outras Informações

### Packages

- [@saas-monorepo/auth](./packages/auth/)
- [@saas-monorepo/env](./packages/env/)
- [@saas-monorepo/tsconfig](./config/typescript-config/)

### TypeScript

- [@saas-monorepo/tsconfig](./config/typescript-config/)

#### Configuração para o Backend

No backend, foram adotadas duas formas de autenticação: por email/senha e pelo GitHub (OAuth). O SQLite foi utilizado como banco de dados, onde foram criadas as seguintes tabelas:

1. **User**: Armazenou todas as informações referentes ao usuário, incluindo dados pessoais e credenciais.
2. **Token**: Foi responsável por armazenar códigos de alteração de senha.
3. **Account**: Guardou informações relacionadas à conta do GitHub e esteve vinculada a um usuário.
4. **Invite**: Armazenou convites feitos por um usuário para outro, incluindo a função do convidado e detalhes sobre a organização.
5. **Member**: Registrou informações como função, organização e usuário. Um membro pôde ser classificado como admin, member ou billing.
6. **Organization**: Salvou informações essenciais da organização, como slug, domínio e proprietário, além de detalhes sobre convites, membros e projetos pertencentes a ela.
7. **Project**: Armazenou detalhes do projeto, da organização e do proprietário do projeto.

Essa estrutura permitiu uma gestão eficiente de usuários, projetos e organizações, garantindo uma organização clara e funcional para o sistema.

#### Configuração para o Frontend

- Descrição da configuração para o frontend em TypeScript.
