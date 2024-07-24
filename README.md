## Busca Auxiliados

Em virtude da impossibilidade de enviar arquivos muito pesados para o Github, este buscador realiza busca somente de pessoas do Distrito Federal, a fim de demonstração. Porém, você pode encontrar o link para a base de dados completa no readme do repositório deste projeto. Basta clonar o repositório e substituir o arquivo all_df.db pelo all.db.

## Instalação

Faça download da base de dados completa no seguinte link:

https://drive.google.com/file/d/1BB6JiekFSvaLLuwUSzcoM2NzFC07YYhp/view?usp=sharing

Clone o repositório, abra-o e digite npm install para instalar todas as dependências. Em seguida, use o comando npm run dev para executar o projeto no endereço http://localhost:3000/

## Como a base de dados foi feita

Todos os arquivos .csv disponíveis no Portal da Transparência foram baixados (https://portaldatransparencia.gov.br/download-de-dados/auxilio-emergencial). Em seguida, fazendo-se uso de NodeJS, percorri todos os arquivos de 5 milhões em 5 milhões, a fim de não sobrecarregar a memória, e já aproveitando para filtrar somente com os dados que eu queria: nome, cpf, uf e município.

Depois, com vários .csv criados, cada um contendo 5 milhões de registros, eu os unifiquei usando a biblioteca csv-merger (https://www.npmjs.com/package/csv-merger).

A fim de remover as duplicatas, transformei o .csv unificado em arquivo sqlite3, da seguinte maneira:

1. sqlite3 all.db "CREATE TABLE people (uf TEXT, municipio TEXT, nome TEXT, cpf TEXT);"
2. sqlite3 all.db
3. .mode csv
4. .import all.csv people

Depois, removi as duplicatas estado por estado, a fim de não sobrecarregar a memória. Por exemplo, para o estado do Acre, fiz:

1. .mode column
2. .mode csv
3. .output student_details.csv
4. SELECT DISTINCT uf, municipio, nome, cpf FROM people WHERE uf = 'AC';

Dessa maneira, obtive um arquivo csv para cada estado, sem duplicatas. Então, novamente usei o csv-merger para unir todos os estados e importei o csv unificado novamente para um sqlite, só que dessa vez sem as duplicatas. Esse arquivo sqlite contém 68 milhões de registros diferentes e pode ser baixado no link do drive passado acima.