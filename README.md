# Ponto Certo

Crie a base de um aplicativo web responsivo de controle de ponto de funcionários, pensado principalmente para uso em celular.

O aplicativo deve ter uma interface moderna, limpa e profissional, em português do Brasil.

IMPORTANTE:

Não implemente funcionalidades além das solicitadas nesta etapa.

Prepare a arquitetura do projeto para receber as próximas funcionalidades.

Utilize uma estrutura organizada e escalável.

O sistema deverá utilizar autenticação e banco de dados.

Não use dados fictícios como solução definitiva.

Perfis de usuário

Crie dois perfis:

Funcionário

Administrador

Autenticação

Implemente:

Tela de login com e-mail e senha.

Logout.

Controle de sessão.

Redirecionamento conforme o perfil do usuário.

Funcionários não podem acessar telas administrativas.

Administradores podem acessar a área administrativa.

Banco de dados

Crie a estrutura inicial necessária para:

usuários

perfis/permissões

Cada usuário deve possuir pelo menos:

id

nome

e-mail

senha/autenticação segura

perfil

status ativo/inativo

data de criação

Interface

Crie:

Tela de login.

Layout principal do funcionário.

Layout principal do administrador.

Navegação responsiva.

Menu apropriado para celular.

Para o funcionário, deixe preparado um dashboard onde posteriormente será colocado o botão de "Registrar Ponto".

Para o administrador, deixe preparado um dashboard onde posteriormente serão colocados os registros e gerenciamento dos funcionários.

Não implemente ainda geolocalização, câmera/foto, registro de ponto ou relatórios. Nesta etapa, concentre-se na fundação do sistema, autenticação, banco de dados, permissões e layout.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1579945f-0f1f-4cf8-9dc7-8b33e4aa1284).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
