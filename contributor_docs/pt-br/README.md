Olá! Obrigado pelo seu interesse em contribuir para o p5.js! Você pode começar com algumas maneiras diferentes de contribuir [aqui](https://p5js.org/community/#contribute). Esta pasta contém vários documentos destinados aos desenvolvedores do p5.js.

# Estrutura de Diretório do Projeto

* `src/` contém todo o código fonte da biblioteca, que é organizado topicamente em módulos separados. É nisso que você trabalhará se estiver mudando o p5.js.
* `lib/` contém a versão final do p5.js destinada aos usuários para carregar seus esboços e projetos, incluídos nas formas compactada e não compactada. Essa é a saída quando os módulos do código-fonte são compilados em um único arquivo pelo [Grunt](https://gruntjs.com/).
* `contributor_docs/` contém vários documentos em Markdown que provavelmente serão úteis para os desenvolvedores de p5.js, em particular porque explicam práticas e princípios.
* `docs/` na verdade não contém docs! Em vez disso, ele contém o código usado para *gerar* o [manual de referência on-line](https://p5js.org/reference/).
* `tests/` contém testes de unidade que garantem que a biblioteca continue funcionando corretamente conforme as alterações são feitas.
* `tasks/` contém scripts que executam tarefas automatizadas relacionadas à construção, implantação e release de novas versões do p5.js.
* `patches/` pode conter [patches Git](https://git-scm.com/docs/git-format-patch) de tempos em tempos, mas em quase todos os casos você pode ignorar completamente esse diretório.

# Como Contribuir

Bugs conhecidos e novas funcionalidades pretendidos são rastreados usando as [issues do GitHub](https://github.com/processing/p5.js/issues). Os [rótulos das issues](./ issue_labels.md) são usados para classificar as issues em categorias, como aqueles que são [adequados para iniciantes](https://github.com/processing/p5.js/labels/level%3Abeginner). Se você deseja começar a trabalhar em uma issue existente, comente na issue que planeja trabalhar para que outros colaboradores saibam que ele está sendo tratado e possam oferecer ajuda. Depois de concluir seu trabalho sobre essa issue, [envie uma solicitação de pull request (PR)](./preparing_a_pull_request.md) na branch main do p5.js. No campo de descrição da PR, inclua "resolves #XXXX" identificando a issue que você está corrigindo. Se o PR resolver a issue, mas não a resolver completamente (por exemplo, a issue deve permanecer aberta após o merge do PR), escreva "addresses #XXXX".

Se você descobrir um bug ou tiver uma idéia para uma nova funcionalidade que gostaria de adicionar, comece submetendo uma issue. Por favor, não basta enviar simplesmente uma solicitação de pull request contendo a correção ou a nova funcionalidade sem antes fazer uma issue, provavelmente não seremos capazes de aceitá-lo. Depois de receber algum feedback sobre a issue e avançar para resolvê-la, você pode seguir o processo acima para contribuir com a correção ou a funcionalidade.

Você pode rastrear as issues que podem incluir a reprodução de relatórios de bugs ou a solicitação de informações vitais, como números de versão ou instruções de reprodução. Se você deseja iniciar issues de triagem, uma maneira fácil de começar é se [inscrever no p5.js. no CodeTriage](https://www.codetriage.com/processing/p5.js). [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

Reconhecemos todos os tipos de contribuições. Este projeto segue a especificação de [all-contributors](https://github.com/kentcdodds/all-contributors). Adicione-se ao readme seguindo as [instruções aqui](https://github.com/processing/p5.js/issues/2309)!

## Acompanhamentos

Além do código em si, também pode ser necessário fornecer alguma combinação do seguinte.

- [documentação embutida](./inline_documentation.md) na forma de comentários de código, que explicam o código para outros desenvolvedores e usuários. Muitos desses comentários devem estar em conformidade com a sintaxe [JSDoc](https://usejsdoc.org) e serão publicados no site p5.js como parte do [manual de referência on-line](https://p5js.org/reference/ )
- [testes de unidade](./unit_testing.md), pequenos pedaços de código que são separados da biblioteca e são usados para verificar seu comportamento

## Exemplos

O site p5.js. inclui [exemplos integrados](http://p5js.org/examples/). Você pode [adicionar mais](https://github.com/processing/p5.js-website/blob/main/contributor_docs/Adding_examples.md) e há uma issue que lista alguns [exemplos desejados](https://github.com/processing/p5.js/issues/1954).

## ES6

O p5.js foi recentemente migrado para o [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015). Para ver como essa transição poderia afetar sua contribuição, visite a [adoção do ES6](./es6-adoption.md).

## Outras Ideas

Se você deseja contribuir de outras maneiras que não são abordadas aqui, escreva para [hello@p5js.org](mailto:hello@p5js.org) e nos informe o que você está pensando! Além de trabalhar nessa base de código, sempre podemos usar ajuda em documentação, tutoriais, workshops, materiais educacionais, branding e design. Entre em contato e podemos conversar sobre como você pode participar.