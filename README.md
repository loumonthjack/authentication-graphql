
# Authentication GraphQL

Basic authentication using JWT token Apollo GraphQL Server and Shield



## Tech Stack

**Language:** Typescript

**Server:** Express, Apollo GraphQL

**Libraries:** Prisma, JSON Web Token, Zod, Nodemon, Bcrypt

**Database**: Postgres
## Run Locally

Clone the project

```bash
  git clone https://github.com/loumonthjack/authentication-graphql auth-project
```

Go to the project directory

```bash
  cd auth-project
```

Install dependencies

```bash
  npm install
```
Copy over .env to .env.example, be sure DATABASE_URL is filled out
```bash
  cp .env.example .env
```
Generate Prisma Schema
```bash
  npm run generate
```
Run Migrations
```bash
  npm run migrate:deploy
```
Start the server

```bash
  npm run start:dev
```



## API Reference

```http
  POST /graphql
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `whoami` | `Query` | **Required**. Authentication Bearer Token |
| `login` | `Mutation` | Login as a User |
| `register` | `Mutation` | Register as a New User |


