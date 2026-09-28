# Aticurando — Projeto Integrador

O **Aticurando** é uma aplicação web desenvolvida como Projeto Integrador, com backend em Node.js/Express/TypeScript e frontend em React/TypeScript.

Esta documentação também registra a implementação da **P1 — Autenticação e Controle de Acesso**, incluindo cadastro, login com JWT, autorização por perfil, sessão no frontend e recuperação de senha por e-mail.

## Tecnologias

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Zod
- Brevo — envio de e-mails transacionais

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- React Hook Form

## Funcionalidades de autenticação

O projeto possui:

- cadastro de usuário com validação dos dados;
- prevenção de e-mail e CPF duplicados;
- armazenamento seguro de senha com bcrypt;
- login com geração de JWT;
- autenticação por token `Bearer`;
- perfis `ADM`, `ALUNO` e `PROFESSOR`;
- autorização de rotas por perfil;
- manutenção da sessão no frontend;
- logout com remoção da sessão armazenada;
- fluxo "Esqueci minha senha";
- recuperação de senha por e-mail com Brevo;
- token de recuperação temporário e de uso único.

## Repositório

Backend e documentação principal:

https://github.com/matos795/Projeto-PI-Aticurando

> O frontend React é mantido pelo grupo em projeto separado. Para a entrega da P1, inclua também o link do frontend no documento entregue ao professor, caso ele esteja em outro repositório.

---

# Como executar o backend

## Pré-requisitos

Antes de iniciar, tenha instalado:

- Node.js e npm;
- MongoDB local ou acesso a uma instância MongoDB;
- Git.

Para testar a recuperação de senha também é necessário possuir uma conta Brevo configurada com:

- API Key;
- remetente verificado.

## 1. Clonar o projeto

```bash
git clone https://github.com/matos795/Projeto-PI-Aticurando.git
cd Projeto-PI-Aticurando
```

## 2. Instalar as dependências

```bash
npm install
```

## 3. Criar o arquivo `.env`

Use o arquivo `.env.example` como modelo.

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux/macOS/Git Bash:

```bash
cp .env.example .env
```

Configure as variáveis:

```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/aticurando

JWT_SECRET=uma_chave_secreta_segura
JWT_EXPIRES_IN=1d

USER_ADMIN=admin@example.com
USER_ADMIN_PASSWORD=uma_senha_segura

BREVO_API_KEY=sua_api_key
BREVO_SENDER_EMAIL=remetente_verificado@example.com
BREVO_SENDER_NAME=Aticurando

FRONTEND_URL=http://localhost:5173
PASSWORD_RESET_EXPIRES_MINUTES=30
```

### Variáveis principais

| Variável | Finalidade |
| --- | --- |
| `PORT` | Porta do backend |
| `MONGO_URI` | Conexão com o MongoDB |
| `JWT_SECRET` | Assinatura e validação dos JWTs |
| `JWT_EXPIRES_IN` | Tempo de validade do JWT |
| `USER_ADMIN` | E-mail do administrador padrão |
| `USER_ADMIN_PASSWORD` | Senha do administrador padrão |
| `BREVO_API_KEY` | Chave da API do Brevo |
| `BREVO_SENDER_EMAIL` | Remetente validado no Brevo |
| `BREVO_SENDER_NAME` | Nome exibido como remetente |
| `FRONTEND_URL` | URL usada no link de redefinição de senha |
| `PASSWORD_RESET_EXPIRES_MINUTES` | Validade do token de recuperação |

> O arquivo `.env` está ignorado pelo Git e não deve ser enviado ao repositório.

Se a segurança de IP estiver habilitada na conta Brevo, o IP que executa o backend também precisa estar autorizado na plataforma.

## 4. Garantir que o MongoDB esteja disponível

Com a configuração padrão:

```text
mongodb://localhost:27017/aticurando
```

o MongoDB precisa estar rodando localmente antes de iniciar a API.

## 5. Executar o backend

```bash
npm run dev
```

Por padrão, a API ficará disponível em:

```text
http://localhost:3002/aticurando/v1
```

---

# Como executar o frontend

No diretório do projeto React/Vite utilizado pelo grupo:

## 1. Instalar dependências

```bash
npm install
```

## 2. Conferir a URL da API

O frontend deve apontar para:

```text
http://localhost:3002/aticurando/v1
```

Na implementação atual, essa configuração fica no serviço responsável pela instância do Axios.

## 3. Executar

```bash
npm run dev
```

O Vite normalmente disponibiliza o frontend em:

```text
http://localhost:5173
```

Essa URL deve ser compatível com `FRONTEND_URL` no backend para que o link enviado no e-mail de recuperação abra a página correta.

---

# Autenticação e controle de acesso

## Cadastro

```http
POST /aticurando/v1/auth/register
```

O cadastro passa por validação com Zod antes de chegar à camada de serviço. A senha é armazenada somente após hashing com bcrypt.

## Login

```http
POST /aticurando/v1/auth/login
```

Em caso de sucesso, a API retorna um JWT e os dados básicos do usuário.

Exemplo de requisição:

```json
{
  "email": "usuario@example.com",
  "senha": "SenhaSegura123"
}
```

As requisições autenticadas devem enviar:

```http
Authorization: Bearer <token>
```

## Usuário autenticado

```http
GET /aticurando/v1/auth/me
```

Essa rota exige um JWT válido.

## Perfis e autorização

Os perfis existentes são:

- `ADM`
- `ALUNO`
- `PROFESSOR`

O backend utiliza middlewares para:

1. validar o JWT;
2. identificar o usuário;
3. verificar se o perfil possui permissão para a rota.

Quando o usuário está autenticado, mas não possui o perfil necessário, a API responde com **403 Forbidden**.

---

# Recuperação de senha

## 1. Solicitar recuperação

```http
POST /aticurando/v1/auth/forgot-password
```

Body:

```json
{
  "email": "usuario@example.com"
}
```

Por segurança, a resposta não informa se o e-mail está ou não cadastrado.

## 2. E-mail de recuperação

Quando o usuário existe, o backend:

1. gera um token criptograficamente aleatório;
2. salva apenas o hash SHA-256 desse token;
3. registra uma data de expiração;
4. envia o token original no link por meio do Brevo.

Exemplo de link:

```text
http://localhost:5173/reset-password?token=TOKEN
```

## 3. Redefinir a senha

```http
POST /aticurando/v1/auth/reset-password
```

Body:

```json
{
  "token": "TOKEN_RECEBIDO_NO_EMAIL",
  "senha": "NovaSenha123",
  "confirmarSenha": "NovaSenha123"
}
```

O backend valida o token e sua expiração, gera o novo hash da senha e invalida o token de recuperação após o uso.

---

# Fluxo demonstrável da P1

Para validar a integração completa:

1. cadastrar um novo usuário;
2. fazer login;
3. receber e armazenar o JWT no frontend;
4. acessar uma página/recurso autenticado;
5. enviar o JWT nas requisições protegidas;
6. demonstrar uma função permitida para um perfil e negada para outro;
7. realizar logout e confirmar a remoção da sessão;
8. solicitar recuperação de senha;
9. receber o e-mail enviado pelo Brevo;
10. abrir o link de redefinição;
11. cadastrar uma nova senha;
12. fazer login utilizando a nova senha.

---

# Segurança

- senhas não são armazenadas em texto puro;
- o backend utiliza bcrypt para hash de senha;
- o JWT secret e demais credenciais ficam no `.env`;
- o `.env` não é versionado;
- rotas protegidas validam o JWT no backend;
- autorização por perfil também é verificada no backend;
- tokens de recuperação possuem expiração;
- apenas o hash do token de recuperação é armazenado no banco;
- o token é invalidado após uma redefinição bem-sucedida;
- a recuperação de senha não revela se determinado e-mail está cadastrado.

---

# Estrutura do backend

```text
src/
├── config/
├── errors/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── curso/
│   ├── dashboard/
│   ├── materia/
│   ├── matricula/
│   ├── turma/
│   └── user/
├── services/
│   └── email/
├── app.ts
├── routes.ts
└── server.ts
```

O projeto segue uma organização modular em camadas, separando rotas, controllers, services, models, validações e middlewares.
