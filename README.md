# Projeto Labeddit Backend


# Lista de requisitos

- Documentação Postman de todos os endpoints (obrigatória para correção)

- Endpoints

  - [ ] signup
  - [ ] login
  - [ ] get users
  - [ ] create post
  - [ ] get posts
  - [ ] like / dislike post
  - [ ] create comment
  - [ ] get comments
  - [ ] like / dislike comment

- Autenticação e autorização

  - [ ] identificação UUID
  - [ ] senhas hasheadas com Bcrypt
  - [ ] tokens JWT

- Código

  - [ ] POO
  - [ ] Arquitetura em camadas
  - [ ] Roteadores no Express

- README.md

# Documentação

https://documenter.getpostman.com/view/28316405/2sA2r7zhyy

# Repositório Labeddit Frontend

https://github.com/Cristian91Assuncao/labeddit-frontend/

# Deploy Labeddit Frontend

https://blue-loaf.surge.sh/


# Deploy Labeddit Backend



## Tecnologias Utilizadas

- TypeScript
- Node.js
- Express
- SQLite3
- Bcrypt.js
- Knex
- Jest
- Cors
- Date-fns
- Dotenv
- Jsonwebtoken
- Uuid
- Zod

## Instruções de instalação

1. Clone o repositório.
2. No gerenciador de pacotes NPM, execute:

```sh
npm i
```

3. Crie seu próprio arquivo `file-name.db` na pasta `database`.
4. Abra o arquivo `labbedit.sql` e execute os comandos de criação de tabela.
5. Crie um arquivo chamado `.env` na raiz do projeto para colocar essas variáveis ​​de ambiente.

```sh

#Porto Expresso
PORTA=3003
#Caminho do arquivo do banco de dados SQLite
DB_FILE_PATH=./src/database/nome-do-arquivo.db
#Credenciais e chaves secretas
JWT_KEY=escolheu uma chave secreta
#Tempo de expiração do token (exemplo: 1 dia)
JWT_EXPIRES_IN=1d
```

6. Execute o servidor.

```sh
npm run dev
```

## Testes

Para rodar todos os testes:

```bash
npm run test
```

Para rodar todos os testes detalhadamente:

```bash
npm run test:verbose
```

Para rodar a cobertura de todos os testes:

```bash
npm run test:coverage
```

# Token payload e User roles

O enum de roles e o payload do token JWT devem estar no seguinte formato:

```typescript
export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}
```

# Exemplos de requisição

## Signup

Endpoint público utilizado para cadastro. Devolve um token jwt.

```typescript
// request POST /users/signup
// body JSON
{
  "name": "Beltrana",
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 201 CREATED
{
  token: "um token jwt"
}
```

## Login

Endpoint público utilizado para login. Devolve um token jwt.

```typescript
// request POST /users/login
// body JSON
{
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 200 OK
{
  token: "um token jwt"
}
```

## Get users

Endpoint protegido, requer um token jwt para acessá-lo.

```typescript
// request GET /users
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "77d39ba1-532e-4e4f-9df8-672a5e91f143",
        "nickname": "Cristian",
        "email": "cristian@email.com",
        "role": "NORMAL",
        "createdAt": "2024-02-15T21:16:34.922Z"
    },
    {
        "id": "2d5ad753-7404-4ef1-bdfe-130e5ea814f2",
        "nickname": "Amanda",
        "email": "amanda@email.com",
        "role": "NORMAL",
        "createdAt": "2024-02-15T23:56:28.738Z"
    }
]
``` 

## Create post

Endpoint protegido, requer um token jwt para acessá-lo.

```typescript
// request POST /posts
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Post novo!"
}

// response
// status 201 CREATED
```

## Get posts

Endpoint protegido, requer um token jwt para acessá-lo.

```typescript
// request GET /posts
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "uma uuid v4",
        "content": "Hoje vou estudar POO!",
        "likes": 2,
        "dislikes" 1,
        "createdAt": "2023-01-20T12:11:47:000Z"
        "updatedAt": "2023-01-20T12:11:47:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Fulano"
        }
    },
    {
        "id": "uma uuid v4",
        "content": "kkkkkkkkkrying",
        "likes": 0,
        "dislikes" 0,
        "createdAt": "2023-01-20T15:41:12:000Z"
        "updatedAt": "2023-01-20T15:49:55:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Ciclana"
        }
    }
]
```

## Create comment

Endpoint protegido, requer um token jwt para acessá-lo.

```typescript
// request COMMENT /comments
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Comentário novo!"
}

// response
// status 201 CREATED
```

## Like or dislike post/comment (mesmo endpoint faz as duas coisas)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Quem criou o post não pode dar like ou dislike no mesmo.<br><br>
Caso dê um like em um post que já tenha dado like, o like é desfeito.<br>
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.<br><br>
Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.<br>
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.

### Like (funcionalidade 1)

```typescript
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": true
}

// response
// status 200 OK
```

### Dislike (funcionalidade 2)

```typescript
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": false
}

// response
// status 200 OK
```

### Para entender a tabela likes_dislikes

- no SQLite, lógicas booleanas devem ser controladas via 0 e 1 (INTEGER)
- quando like valer 1 na tabela é porque a pessoa deu like no post
- na requisição like é true
- quando like valer 0 na tabela é porque a pessoa deu dislike no post
- na requisição like é false
- caso não exista um registro na tabela de relação, é porque a pessoa não deu like nem dislike
- caso dê like em um post que já tenha dado like, o like é removido (deleta o item da tabela)
- caso dê dislike em um post que já tenha dado dislike, o dislike é removido (deleta o item da tabela)


Feito por <a href="https://github.com/Cristian91Assuncao" target="_blank">Cristian Assunção</a>