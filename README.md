<h1 align="center" style="margin: 30px 0;">
    <br>
    Sistema de Gestão para Observações Pedagógicas
</h1>
<p align="center">
    Trabalho de Conclusão do Curso de Bacharelado em Ciência da Computação.<br>
    Gabriela Marangoni Radigonda<br>
    Orientador: Prof. Rafael Liberato<br>
    <i>Fevereiro de 2025</i> 
</p>
<br>


Este sistema foi desenvolvido para auxilar a Coordenação e os Professores do Curso Técnico Integrado do Campus de Campo Mourão no acompanhamento pedagógico e disciplinar dos alunos.



<p align="center"><b>
<h1>Sumário</h1>
    
<ul>
<li><a href="#instalação">Instalação</a><br/><br/></li>
<li><a href="#introdução">Introdução</a><br/><br/></li>
<li><a href="#processo">Processo</a><br/><br/></li>
<li><a href="#arquitetura">Arquitetura</a><br/><br/></li>
<li><a href="#tecnologias">Tecnologias</a><br/><br/></li>
<li><a href="#Variáveis-de-ambiente">Variáveis de ambiente</a><br/><br/></li>
<li><a href="#banco-de-dados">Banco de dados</a><br/><br/></li>
<li><a href="#rotas">Rotas</a><br/><br/></li>
<li><a href="#telas">Telas</a><br/><br/></li>
</ul>
</b></p>

# Instalação

Clique no link abaixo para acessar o passo a passo da instalação do sistema

[Instalação](Backend/readme.md)

# Introdução

A Universidade Tecnológica Federal do Paraná (UTFPR), criada em 1909 como Escola de Aprendizes e Artífices, passou por importantes transformações, tornando-se Centro Federal de Educação Tecnológica (CEFET-PR) em 1978 e Universidade Tecnológica em 2005. Apesar da mudança, o campus de Campo Mourão manteve o ensino técnico, atualmente ofertado no Curso Técnico Integrado em Informática para Internet, que combina disciplinas do Ensino Médio com formação técnica.

A transformação em universidade trouxe desafios à coordenação do curso, especialmente no acompanhamento dos adolescentes, que vivem uma fase de transições cognitivas, físicas e emocionais. Essa realidade exige maior apoio psicossocial e envolvimento das famílias.

O conselho de classe pode ser uma ferramenta essencial para identificar dificuldades, acompanhar o desempenho escolar, oferecer suporte e definir estratégias pedagógicas. Porém, a estrutura organizacional da universidade, com professores de diferentes departamentos, dificulta a implementação de um modelo tradicional de conselho de classe.

Diante deste cenário, este trabalho tem como objetivo o desenvolvimento de um sistema web para prover um ambiente online que permita à coordenação, juntamente com os professores, realizar atividades semelhantes às de um conselho de classe tradicional. O sistema busca proporcionar uma comunicação mais eficiente e direta entre os professores e a coordenação do curso, atendendo às necessidades e demandas de maneira mais eficaz.

Entre os principais objetivos do sistema, destacam-se:

- Realizar e trocar observações sobre os alunos;
- Criar grupos de monitoramento para acompanhamento dos alunos.

# Processo

A Figura a seguir apresenta o Diagrama de Caso de Uso, destacando os processos utilizados pelo professor e pela coordenação.
<img  style="margin: 0 10px;" alt="bd-img" src="assets/diagrama.png" />





# Arquitetura

O sistema está estruturado com uma arquitetura de back-end e front-end. A Figura a seguir ilustra a arquitetura e as tecnologias utilizadas em cada parte.

<p align="center">
    <img src="assets/arquitetura.png" width="100%" tittle="arquitetura">
</p>

# Tecnologias:

O backend deste projeto foi desenvolvido com as seguintes tecnologias:

- [Node.Js](https://nodejs.org/en/about)
- [Prisma](https://www.prisma.io/)


O frontend foi desenvolvido com as seguintes tecnologias:

- [Next.js](https://nextjs.org)
- [ReactJS](https://reactjs.org/)
- [Axios](https://github.com/axios/axios)
- [Tailwind CSS](https://tailwindcss.com)
- [ESlint](https://eslint.org/)
- [Remix](https://remixicon.com/)


# Variáveis de ambiente

Em /Backend/.env existem variáveis usadas para o funcionamento do ambiente do servidor.

A primeira delas é a **DATABASE_URL**, a url da base de dados, se for utilizar outra base, é necessário alterar este link pelo da base que deseja utilizar.

Para o envio de email também é necessário trocar variáveis no .env o **USERMAIL** deve ser substituído pelo email que irá enviar emails no sistema.

O **PASSMAIL** é uma senha gerada pelo provedor de email, no caso do Gmail siga estes [passos](https://support.google.com/accounts/answer/185833?hl=pt-BR) para saber como gerar uma.

Por fim, **EMAILPRATCC** é a variável que deve contér como valor o email do PRATCC, com essa informação ele poderá receber emails de quem está requisitando novos professores para o sistema.

# Banco de Dados

O banco de dados foi modelado para armazenar e gerenciar informações sobre usuários, professores, alunos, disciplinas, calendário acadêmico, grupos de monitoramento e documentos.

- Usuários (USER): Contém credenciais de login (email e senha) e um identificador que diferencia coordenador.
- Professores (PROFESSOR): Associados a um usuário, armazenam informações como nome e telefone.
- Estudantes (ESTUDANTE): Identificados pelo RA, possuem informações de contato e status de exclusão.
- Disciplinas (DISCIPLINA): Contêm o nome e o ano da disciplina, podendo ser associadas a professores ou alunos futuramente.
- Calendário (CALENDARIO): Registra links de calendários acadêmicos com datas associadas.
- Documentos (DOCUMENTO): Armazena arquivos cadastrados no sistema, contendo um título, descrição, link e data de criação.
- Relacionamento entre Professores e Alunos (PROF_ALUNO): Tabela intermediária que conecta professores a alunos, permitindo monitoramento individual.
- Grupos (GRUPO): Criados por um usuário para acompanhar alunos específicos, registrando observações e notificações.

A modelagem segue boas práticas de normalização, utilizando UUIDs para garantir unicidade nos identificadores e facilitar escalabilidade. O diagrama abaixo ilustra os relacionamentos entre as tabelas e como os dados estão organizados no sistema.

<img  width="100%" tittle="banco de dados" src="assets/bd.jpg" />



# Interface do Sistema: Telas e Finalidades

O sistema é dividido em duas partes: Geral e Gerenciamento.

- Na parte Geral, estão as telas de Dashboard, Alunos, Documentos, Calendário Acadêmico e Minhas Observações.
- No Gerenciamento, encontram-se Alunos Inativos e os módulos para Cadastro de Alunos, Professores, Disciplinas, Documentos e Calendário Acadêmico, além das funcionalidades de criação de Grupos e gerenciamento do Meu Perfil.

O professor tem acesso apenas à parte Geral, que inclui as telas de Dashboard, Alunos, Documentos, Calendário Acadêmico e Minhas Observações. Na parte de Gerenciamento, seu acesso é restrito apenas à criação de Grupos e ao gerenciamento do próprio Perfil.


### Dashboard
A tela de Dashboard exibe um resumo do sistema, incluindo a quantidade de alunos, professores e disciplinas cadastradas, além de permitir o monitoramento dos grupos e das observações.

- Grupo: No primeiro card, são listados todos os grupos criados pelo usuário, juntamente com a quantidade de alunos em cada um. Ao clicar em um grupo, o usuário é redirecionado para a tela de observações, onde pode visualizar os alunos que estão sendo monitorados.

- Acompanhamento dos Grupos: No segundo card, são listadas as últimas 10 observações feitas nos alunos que o usuário está monitorando. Ao clicar em uma observação, o usuário é redirecionado para a tela do aluno, onde pode visualizar todas as suas observações. Nessa tela, são exibidos o nome do aluno, a matéria, o período e o usuário que registrou a observação. Se o aluno pertence a algum grupo, essa informação também será exibida. Além disso, é possível adicionar uma nova observação para esse aluno.

- Acompanhamento Geral: No terceiro card, são listadas as últimas 10 observações feitas em todos os alunos cadastrados. Ao clicar em uma observação, o usuário é redirecionado para a mesma tela do card "Acompanhamento dos Grupos", onde pode visualizar os detalhes e adicionar novas observações.

<p align="center"> <img src="" width="100%" tittle=""> </p>
<p align="center"> <img src="" width="100%" tittle=""> </p>
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Alunos
A tela de Alunos exibe a lista de todos os alunos cadastrados no sistema, apresentando as seguintes informações: RA, nome, telefone, e-mail e a quantidade de observações registradas para cada aluno. Além disso, conta com uma barra de pesquisa, permitindo localizar rapidamente um aluno pelo nome.

<p align="center"> <img src="" width="100%" tittle=""> </p>

### Documentos
A tela de Documentos permite a visualização de todos os arquivos cadastrados no sistema. Nela, os usuários podem acessar, consultar e, se necessário, fazer o download dos documentos disponibilizados pela coordenação. A tela facilita a organização e o acesso rápido a materiais importantes para a gestão acadêmica.

<p align="center"> <img src="" width="100%" tittle=""> </p>

### Calendário Acadêmico
A tela de Calendário Acadêmico permite o acesso ao calendário oficial do curso. Ao clicar na opção disponível, o usuário é redirecionado para uma nova aba com o calendário cadastrado pela coordenação, sem visualizar diretamente o link no sistema.

<p align="center"> <img src="" width="100%" tittle=""> </p>

### Minhas Observações
A tela 'Minhas Observações' permite ao usuário visualizar todas as observações que ele registrou. Além disso, é possível acessar as observações de todos os alunos e filtrar especificamente aquelas dos alunos que estão sendo monitorados em um grupo específico. Nesta tela, o usuário também pode adicionar uma nova observação. 

<p align="center"> <img src="" width="100%" tittle=""> </p>
<p align="center"> <img src="" width="100%" tittle=""> </p>
<p align="center"> <img src="" width="100%" tittle=""> </p>
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Alunos Inativos
A tela 'Alunos Inativos' exibe a lista de alunos que foram deletados pela coordenação. Quando um aluno é removido, seus dados são armazenados nessa tela, permitindo a visualização de todas as observações registradas para ele. Além disso, a coordenação tem a opção de reativar o aluno, restaurando seu acesso ao sistema.

<p align="center"> <img src="" width="100%" tittle=""> </p>


### Cadastro de Alunos
Na tela "Cadastro de Alunos", a tela inicial exibe uma tabela com os alunos já cadastrados, acompanhada de uma barra de pesquisa para localizar um aluno pelo nome. Além disso, há dois botões principais: "Cadastrar" e "Excluir Vários".

Os alunos cadastrados podem ter seus dados editados (exceto o RA) ou serem excluídos manualmente.
<p align="center"> <img src="" width="100%" tittle=""> </p>

- Ao clicar em "Cadastrar", o usuário é redirecionado para a tela de cadastro, onde pode optar por cadastrar um único aluno manualmente ou realizar um cadastro coletivo. Para isso, basta copiar e colar os dados diretamente na tela, seguindo o formato: RA, nome, telefone e e-mail, com um aluno por linha e os dados separados por vírgulas.
<p align="center"> <img src="" width="100%" tittle=""> </p>


- Ao clicar em "Excluir Vários", o usuário é levado para a tela de exclusão coletiva, onde pode remover múltiplos alunos cadastrados. Para isso, basta copiar e colar uma lista de RAs, um aluno por linhas.

<p align="center"> <img src="" width="100%" tittle=""> </p>


### Cadastro de Professores 
Na tela "Cadastro de Professores", a tela inicial exibe uma tabela com os professores já cadastrados, acompanhada de uma barra de pesquisa para localizar um professor pelo nome. Além disso, há um botão principal: "Cadastrar".

Os professores cadastrados podem ter seus dados editados (exceto o e-mail) ou serem excluídos manualmente.
<p align="center"> <img src="" width="100%" tittle=""> </p>
- Ao clicar em "Cadastrar", o usuário é redirecionado para a tela de cadastro, onde pode optar por cadastrar um único professor manualmente ou realizar um cadastro coletivo. Para isso, basta copiar e colar os dados diretamente na tela, seguindo o formato: nome, telefone e e-mail, com um professor por linha e os dados separados por vírgulas.
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Cadastro de Disciplinas 
Na tela "Cadastro de Disciplinas", a tela inicial exibe uma tabela com as disciplinas já cadastradas, juntamente com uma barra de pesquisa para localizar uma disciplina pelo nome. Há também um botão principal: "Cadastrar".

As disciplinas cadastradas podem ter todos os seus dados editados, e a exclusão deve ser feita manualmente.
<p align="center"> <img src="" width="100%" tittle=""> </p>

Ao clicar em "Cadastrar", o usuário é redirecionado para a tela de cadastro, onde pode optar por cadastrar uma única disciplina manualmente ou realizar um cadastro coletivo. Para isso, basta copiar e colar os dados diretamente na tela, seguindo o formato: nome da disciplina e período, com uma disciplina por linha e os dados separados por vírgulas.
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Cadastro de Documentos 
Na tela "Cadastro de Documentos", é possível visualizar uma lista com todos os documentos já cadastrados.

Cada documento pode ser editado ou excluído individualmente, garantindo que as informações estejam sempre atualizadas.
<p align="center"> <img src="" width="100%" tittle=""> </p>

Ao clicar no botão "Cadastrar",o usuário é redirecionado para a tela de cadastro. Nessa tela, o usuário pode adicionar um novo documento informando: titulo do documento, descrição e link. 
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Cadastro do Calendário Acadêmico
Na tela "Cadastro do Calendário Acadêmico", a coordenação cadastra o link do calendário, permitindo que, ao ser clicado na seção "Calendário Acadêmico" do sistema, o usuário seja redirecionado automaticamente para o documento ou página correspondente.

Caso precise editar o link posteriormente, basta acessar essa tela e atualizar a informação.
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Grupos
Na tela "Grupos", tanto o coordenador quanto o professor têm acesso. Essa tela permite a criação de grupos para monitoramento de alunos.

Quando um aluno faz parte de um grupo e recebe uma observação de outro usuário, um e-mail é enviado automaticamente para o usuário que criou o grupo, notificando-o sobre a nova observação que o aluno recebeu.

Na tela principal de grupos, é possível visualizar todos os grupos cadastrados. Cada grupo exibe:

- Nome do grupo
- Data de criação
- Alguns alunos do grupo
- Número total de alunos
- Também é possível editar ou excluir um grupo.

<p align="center"> <img src="" width="100%" tittle=""> </p>

Ao clicar no botão "Mostrar mais", o usuário é direcionado para uma tela detalhada do grupo, onde pode visualizar uma tabela completa contendo:

- A lista de todos os alunos pertencentes ao grupo
- A quantidade de observações recebidas por cada aluno
Opções para:
- Remover um aluno do grupo
- Visualizar todas as observações registradas para um aluno
- Adicionar uma nova observação diretamente no sistema

Além disso, nesta tela, há um botão dedicado para editar o grupo, permitindo que o usuário altere informações como nome e composição do grupo.
<p align="center"> <img src="" width="100%" tittle=""> </p>

### Meu Perfil
Na tela "Meu Perfil", tanto o coordenador quanto o professor têm acesso. Nesta tela, é possível:

Visualizar o nome e o e-mail cadastrados
Alterar a senha, garantindo mais segurança para o usuário
As informações de nome e e-mail são apenas para consulta, enquanto a senha pode ser modificada conforme necessário.
<p align="center"> <img src="assets/perfil.png" width="100%" tittle="meu perfil"> </p>


