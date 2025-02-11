# FRONTEND
O frontend do sistema foi desenvolvido para oferecer uma interface intuitiva e responsiva, permitindo que os usuários realizem suas atividades de forma eficiente. Professores podem visualizar alunos, registrar observações e gerenciar grupos de monitoramento, enquanto a coordenação possui acesso exclusivo às funcionalidades administrativas, como o cadastro e gerenciamento de alunos, professores, disciplinas, documentos e calendário acadêmico. Além disso, o sistema conta com um fluxo seguro para redefinição de senha e notificações para novas observações, garantindo uma comunicação eficiente e um acompanhamento pedagógico otimizado.


### Tecnologias utilizadas
O frontend do sistema foi desenvolvido utilizando tecnologias modernas para garantir desempenho, escalabilidade e uma experiência de usuário fluida.

- **Next.js:** Framework baseado em React que possibilita a renderização híbrida (estática e dinâmica), otimização de performance e melhor experiência para o usuário.

- **ReactJS:** Biblioteca JavaScript utilizada para a construção da interface do usuário, permitindo a criação de componentes reutilizáveis e dinâmicos.

- **Axios:** Biblioteca para realizar requisições HTTP, facilitando a comunicação entre o frontend e o backend.

- **Tailwind CSS:** Framework de estilização que proporciona um design responsivo e customizável de forma ágil, utilizando classes utilitárias.

- **Chakra UI:** Biblioteca de componentes para React que facilita a criação de interfaces acessíveis e esteticamente agradáveis com um design consistente.

- **ESLint:** Ferramenta de análise de código que ajuda a manter boas práticas e padronização na escrita do código.

- **Remix:** Framework que aprimora a experiência do usuário, oferecendo navegação mais rápida e otimizada, além de facilitar o gerenciamento de dados e rotas.

### Organização das pastas 

O Next.js segue uma estrutura baseada em convenção para organizar o código, tornando o desenvolvimento mais eficiente e escalável. A organização das pastas dentro da pasta principal **src/** facilita a separação de responsabilidades e melhora a manutenção do projeto.

- **components/** → armazena os componentes reutilizáveis do projeto, proporcionando uma estrutura mais organizada e facilitando a manutenção e reutilização de elementos comuns na aplicação.

- **lib/** → contém utilitários e modelos reutilizáveis. O arquivo **utils.ts** fornece a função cn para manipulação eficiente de classes CSS com clsx e tailwind-merge, enquanto **models/baseModels.ts** define a interface IBasePaginatedResponse para padronizar respostas paginadas da API.

- **pages/** → contém os arquivos **_app.tsx** e **index.tsx**, além das subpastas **api/** para rotas da API e outras pastas organizando as diferentes partes do sistema, mantendo cada funcionalidade em seu respectivo diretório.

- **styles/** → contém o arquivo **globals.css**, responsável por definir estilos globais aplicados a todo o sistema, garantindo padronização na aparência da aplicação.

- **utils/** → contém os arquivos **DateUtil.ts** e **MoneyUtil.ts**, responsáveis por manipulações de datas e formatação de valores monetários, respectivamente.


Fora da pasta **src/**, temos o arquivo **tailwind.config.js**, que configura o Tailwind CSS, definindo diretórios de escaneamento (content), personalizações de tema (theme.extend) como cores, larguras, alturas e imagens de fundo, além de incluir o plugin @tailwindcss/line-clamp para limitar linhas de texto.

# INSTALAÇÃO

1) Instale as dependencias com `yarn` ou `npm install`
2) Inicialize o servidor com `yarn dev` ou `npm run dev`

