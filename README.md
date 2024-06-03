# Projecto de Projetos em Ambientes Web e Cloud

## QuickStart
Instalar node, [pixi](https://pixi.sh/latest/#installation), e [mongosh](https://www.mongodb.com/try/download/shell); dps:
```
git clone --recurse-submodules https://github.com/boladouro/web_e_cloud.git
cd web_e_cloud
npm install
cd backend 
pixi install
pixi run setup-db
"MONGODB_CONECTION_STRING=mongodb://localhost:27017" > .env
cd ..
npm run dev
```
Cada comando está nos respetivos `package.json` e `pixi.toml`, mas:

- `npm run dev` para correr o backend e o frontend em debug mode
- `npm run dev-front` para correr o frontend em debug mode
- `npm run build` para fazer build do frontend
- `npm run preview-build` para correr o frontend em produção
- `cd backend && pixi run setup` para preparar a db
- `cd backend && pixi run start-db` para correr o mongod
- `cd backend && pixi run start-server` para correr o middleman (o que corre os comandos para o mongo)
- `npm run genDocs` generates the api docs

Finalmente, para ver os docs do api, abre o `./backend/docs/index.html`.

## Funcionalidades

### 1. Página inicial

* [X]  a. Seção com destaque para os livros com maior pontuação;
* [X]  b. Campo de pesquisa. Utilizador poderá escrever a frase de pesquisa e selecionar se pretende pesquisar por autor, título ou categoria.

### 2. Página Livros

* [X]  a. Lista em forma de grelha com todos os livros;
* [X]  b. Paginação: apresentar 10 livros por página e botões para saltar de página;
* [X]  c. Ordenar: utilizador deverá ser capaz de ordenar os livros por preço ou pontuação;
* [X]  d. Filtros: utilizador deverá ser capaz de fazer a filtragem de livros por autor ou categoria;
* [X]  e. Botão que permite adicionar livro ao carrinho.

### 3. Página individual de cada livro

* [X]  a. Informação completa de cada Livro
* [X]  b. Botão para adicionar livro ao carrinho de compra

### 4. Página Carrinho

* [X]  a. Lista de todos os livros adicionados à lista de compra;
* [X]  b. Utilizador deverá ser capaz de modificar o número de exemplares para cada livro;
* [X]  c. Remover livro e/ou remover a lista de compras total;

### 5. Considerações gerais:

* [X]  a. Uso de State e Props;
* [X]  b. Reutilização de componentes;
* [X]  c. UseContext para gerir estado global da aplicação;
* [X]  d. A estrutura do site deverá ter um Header com logo e menu;
* [X]  e. No menu incluir o contador com o número total de itens adicionados ao carrinho;
* [X]  f. Footer
* [X]  g. Responsive Design
