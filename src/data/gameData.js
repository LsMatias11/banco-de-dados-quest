// Banco de Dados de Questões e Configurações do Jogo Banco de Dados Quest - C. J. Date

export const QUESTIONS = [
  {
    id: 1,
    section: "6.2 Tuplas",
    badgeAssociated: "Mestre das Tuplas",
    badgeId: "tuples",
    question: "Segundo C. J. Date, qual é a definição formal e precisa de uma tupla no modelo relacional?",
    codeSnippet: null,
    options: [
      "Uma sequência ordenada de valores indexados numericamente de 1 a n.",
      "Um conjunto não ordenado de pares ordenados (A_i, v_i), onde A_i é o nome do atributo e v_i é um valor do tipo de A_i.",
      "Uma linha física gravada em um arquivo de disco de banco de dados SQL.",
      "Um vetor dinâmico de ponteiros para registros na memória principal."
    ],
    correctIndex: 1,
    explanation: "No Cap. 6.2, Date define tupla como um conjunto de pares atributo-valor. Como é um conjunto, os atributos dentro de uma tupla não possuem ordenação da esquerda para a direita."
  },
  {
    id: 2,
    section: "6.2 Tuplas",
    badgeAssociated: "Mestre das Tuplas",
    badgeId: "tuples",
    question: "Sobre a comparação entre 'tuplas' e 'linhas de tabela SQL', qual afirmação está correta segundo C. J. Date?",
    codeSnippet: null,
    options: [
      "Uma linha SQL e uma tupla relacional são conceitos idênticos sem nenhuma diferença.",
      "Linhas SQL possuem ordenação de colunas da esquerda para a direita, enquanto tuplas possuem atributos não ordenados.",
      "Tuplas relacionais aceitam valores nulos (NULL), ao contrário das linhas SQL.",
      "Uma tabela SQL não pode conter linhas duplicadas, assim como uma relação não possui tuplas duplicadas."
    ],
    correctIndex: 1,
    explanation: "Na Seção 6.2/6.6, Date destaca que em SQL as colunas têm posição ordinal (1ª, 2ª), enquanto na Teoria Relacional os atributos são identificados unicamente pelo nome e não têm ordem."
  },
  {
    id: 3,
    section: "6.3 Tipos de Relações",
    badgeAssociated: "Grau & Aridade",
    badgeId: "degree",
    question: "O que constitui o 'cabeçalho' (heading) de uma relação e como se determina o seu grau (degree)?",
    codeSnippet: null,
    options: [
      "O cabeçalho é o número de tuplas e o grau é o total de linhas presentes no banco.",
      "O cabeçalho é um conjunto de pares (atributo: tipo) e o grau é o número n de atributos nesse conjunto.",
      "O cabeçalho é a chave primária e o grau é o número de chaves estrangeiras.",
      "O cabeçalho é o nome da tabela SQL e o grau é o número de índices criados."
    ],
    correctIndex: 1,
    explanation: "Na Seção 6.3, o cabeçalho é definido como um conjunto de pares atributo-tipo. O número n de atributos define o grau (ou aridade) da relação (ex: unária, binária, ternária, n-ária)."
  },
  {
    id: 4,
    section: "6.4 Valores de Relações",
    badgeAssociated: "Guardião dos Valores",
    badgeId: "body",
    question: "O que representa o 'corpo' (body) de um valor de relação e como a sua cardinalidade é definida?",
    codeSnippet: null,
    options: [
      "O corpo é um conjunto de tuplas com o mesmo cabeçalho; a cardinalidade é o número de tuplas no corpo.",
      "O corpo é a lista de comandos SQL e a cardinalidade é o tempo de execução da consulta.",
      "O corpo é a definição dos tipos de dados e a cardinalidade é a quantidade de colunas.",
      "O corpo é a área de armazenamento físico e a cardinalidade é o tamanho do arquivo em bytes."
    ],
    correctIndex: 0,
    explanation: "Na Seção 6.4, Date explica que uma relação é composta por um cabeçalho e um corpo. O corpo é o conjunto de tuplas e a cardinalidade m é a quantidade de tuplas contidas nesse conjunto."
  },
  {
    id: 5,
    section: "6.4 Valores de Relações",
    badgeAssociated: "Guardião dos Valores",
    badgeId: "body",
    question: "Qual das alternativas expressa uma propriedade FALSO/MISTURA sobre relações puras segundo C. J. Date?",
    codeSnippet: null,
    options: [
      "Não existem tuplas duplicadas em uma relação.",
      "As tuplas não estão ordenadas de cima para baixo.",
      "Os atributos são ordenados rigorosamente por sua ordem de criação no banco.",
      "Toda relação está normalizada em Primeira Forma Normal (1FN)."
    ],
    correctIndex: 2,
    explanation: "Na Seção 6.4, Date enfatiza quatro propriedades fundamentais: 1) Sem tuplas duplicadas; 2) Tuplas não ordenadas; 3) Atributos não ordenados; 4) Valores atômicos/1FN. Afirmar que atributos são ordenados é FALSO."
  },
  {
    id: 6,
    section: "6.4 Valores de Relações",
    badgeAssociated: "Valores Atômicos & 1FN",
    badgeId: "atomic",
    question: "O que significa afirmar que toda relação está na Primeira Forma Normal (1FN) na Teoria Relacional clássica de Date?",
    codeSnippet: null,
    options: [
      "Significa que cada valor em cada tupla/atributo é atômico (contém um único valor do tipo subjacente).",
      "Significa que a relação deve obrigatoriamente possuir um número auto-incremental como ID.",
      "Significa que a relação não pode se conectar com outras tabelas por chave estrangeira.",
      "Significa que todos os valores de texto devem ser convertidos para caixa alta."
    ],
    correctIndex: 0,
    explanation: "Na Seção 6.4, Date explica que todo valor de atributo em uma tupla é um valor simples do tipo de dado correspondente. Por definição, relações só contêm valores atômicos, estando intrinsecamente na 1FN."
  },
  {
    id: 7,
    section: "6.5 Variáveis de Relação",
    badgeAssociated: "Especialista em RelVars",
    badgeId: "relvars",
    question: "Qual é a distinção crucial estabelecida por C. J. Date entre um 'Valor de Relação' (Relation Value) e uma 'Variável de Relação' (RelVar)?",
    codeSnippet: null,
    options: [
      "Um valor de relação varia ao longo do tempo, enquanto uma RelVar é uma constante fixa em memória.",
      "Uma RelVar é um container cujo valor (uma relação) muda ao longo do tempo mediante atribuição relacional; um valor de relação é imutável.",
      "Uma RelVar só existe em linguagens orientadas a objetos, enquanto valores de relação são exclusivos do SQL.",
      "Não há diferença; Date trata RelVar e Relação como exatamente o mesmo conceito."
    ],
    correctIndex: 1,
    explanation: "Na Seção 6.5, Date esclarece o erro comum de terminologia: o que comumente chamamos de 'tabela' que é modificada no tempo é na verdade uma RelVar (Variável de Relação). O estado contido nela em um instante é um valor relacional imutável."
  },
  {
    id: 8,
    section: "6.5 Variáveis de Relação",
    badgeAssociated: "Atribuição Relacional",
    badgeId: "assignment",
    question: "Como a operação fundamental de atualização de dados (INSERT, UPDATE, DELETE) é tratada teoricamente em termos de RelVars por C. J. Date?",
    codeSnippet: null,
    options: [
      "Como modificações físicas diretas nos ponteiros de arquivo do sistema operacional.",
      "Como atalhos conceituais para uma operação fundamental de Atribuição Relacional (Relational Assignment).",
      "Como transações assíncronas sem garantias matemáticas de consistência.",
      "Como operações de reinicialização total do esquema do banco de dados."
    ],
    correctIndex: 1,
    explanation: "Na Seção 6.5, Date demonstra que INSERT, UPDATE e DELETE são atalhos para a Atribuição Relacional: a RelVar R recebe o resultado de uma expressão relacional que calcula o novo valor completo da relação."
  },
  {
    id: 9,
    section: "6.5 Variáveis de Relação",
    badgeAssociated: "Especialista em RelVars",
    badgeId: "relvars",
    question: "Qual é a definição rigorosa de uma 'RelVar Virtual' (também conhecida como Visão / View) na Teoria Relacional?",
    codeSnippet: null,
    options: [
      "Uma tabela temporária gravada fisicamente em disco a cada consulta executada.",
      "Uma RelVar cujo valor é calculado como o resultado de uma expressão relacional especificada.",
      "Um índice secundário acelerador de velocidade para tabelas com mais de 1 milhão de linhas.",
      "Uma cópia de backup do banco de dados gerada automaticamente pelo SGBD."
    ],
    correctIndex: 1,
    explanation: "Na Seção 6.5, Date distingue RelVars Básicas (base relvars) de RelVars Virtuais (views). Uma visão é uma relvar cujo valor em qualquer momento é o resultado da avaliação de sua expressão relacional definidora."
  },
  {
    id: 10,
    section: "6.6 Recursos de SQL",
    badgeAssociated: "Purista Relacional (SQL vs Date)",
    badgeId: "purist",
    question: "Por que, de acordo com C. J. Date (Seção 6.6), uma 'tabela SQL' NÃO é estritamente uma 'relação matemática'?",
    codeSnippet: null,
    options: [
      "Porque o SQL permite linhas duplicadas (multisets/sacos), possui ordenação posicional de colunas e suporta NULLs.",
      "Porque o SQL não suporta a operação de junção de tabelas.",
      "Porque tabelas SQL só podem armazenar números inteiros e caracteres.",
      "Porque a Teoria Relacional proíbe o uso de comandos como CREATE TABLE e INSERT."
    ],
    correctIndex: 0,
    explanation: "Na Seção 6.6, Date critica os desvios do SQL em relação à Teoria Relacional: o SQL permite duplicatas (bags em vez de sets), colunas anônimas, ordem de colunas e o conceito de NULL, desviando-se das relações puras."
  },
  {
    id: 11,
    section: "Recursos SQL - DML",
    badgeAssociated: "SELECT Master",
    badgeId: "select",
    question: "Qual comando SQL é utilizado para recuperar dados de uma ou mais tabelas?",
    codeSnippet: "SELECT * FROM usuarios WHERE ativo = true;",
    options: [
      "GET FROM usuarios;",
      "FETCH usuarios;",
      "SELECT * FROM usuarios;",
      "EXTRACT usuarios;"
    ],
    correctIndex: 2,
    explanation: "O comando SELECT é a instrução DML fundamental para realizar consultas e retornar dados de tabelas."
  },
  {
    id: 12,
    section: "Recursos SQL - Joins",
    badgeAssociated: "JOIN Master",
    badgeId: "join",
    question: "Qual tipo de JOIN retorna apenas os registros que possuem correspondência em ambas as tabelas?",
    codeSnippet: "SELECT * FROM A [?] B ON A.id = B.a_id;",
    options: [
      "LEFT JOIN",
      "INNER JOIN",
      "FULL OUTER JOIN",
      "RIGHT JOIN"
    ],
    correctIndex: 1,
    explanation: "O INNER JOIN cruza as duas tabelas e retorna somente as linhas em que há igualdade no critério de junção."
  },
  {
    id: 13,
    section: "Recursos SQL - Transações",
    badgeAssociated: "TRANSACTION Master",
    badgeId: "transaction",
    question: "Qual propriedade ACID garante que todas as operações de uma transação sejam concluídas com sucesso ou nenhuma delas seja aplicada?",
    codeSnippet: "BEGIN TRANSACTION;\n  UPDATE conta SET saldo = saldo - 100 WHERE id = 1;\n  UPDATE conta SET saldo = saldo + 100 WHERE id = 2;\nCOMMIT;",
    options: [
      "Consistência",
      "Isolamento",
      "Durabilidade",
      "Atomicidade"
    ],
    correctIndex: 3,
    explanation: "A Atomicidade ('All or Nothing') garante que a transação seja tratada como uma unidade indivisível de trabalho."
  },
  {
    id: 14,
    section: "Recursos SQL - Otimização",
    badgeAssociated: "INDEX Master",
    badgeId: "index",
    question: "Qual a principal vantagem da criação de um Índice B-Tree em uma coluna frequentemente consultada?",
    codeSnippet: "CREATE INDEX idx_cliente_email ON clientes(email);",
    options: [
      "Aumentar a velocidade das instruções INSERT e UPDATE.",
      "Reduzir o custo de busca de O(N) para O(log N) em consultas SELECT.",
      "Garantir criptografia automática dos dados da coluna.",
      "Eliminar a necessidade de chaves primárias na tabela."
    ],
    correctIndex: 1,
    explanation: "Índices reduzem a necessidade de varredura completa da tabela (Full Table Scan), otimizando a busca para tempo logarítmico O(log N)."
  }
];

// Matriz de Badges da Cartela 3x3 do Bingo Pedagógico
export const BINGO_BADGES = [
  [
    { id: 'tuples', name: 'Mestre das Tuplas', desc: 'Atributos não ordenados e imutabilidade', icon: 'Boxes', section: '6.2' },
    { id: 'degree', name: 'Grau & Aridade', desc: 'Cabeçalho e número n de atributos', icon: 'Layers', section: '6.3' },
    { id: 'body', name: 'Guardião dos Valores', desc: 'Cardinalidade m e conjunto de tuplas', icon: 'Database', section: '6.4' }
  ],
  [
    { id: 'atomic', name: 'Valores Atômicos & 1FN', desc: 'Valores simples e Primeira Forma Normal', icon: 'Atom', section: '6.4' },
    { id: 'relvars', name: 'Especialista em RelVars', desc: 'Container mutável vs Valor imutável', icon: 'Variable', section: '6.5' },
    { id: 'assignment', name: 'Atribuição Relacional', desc: 'INSERT/UPDATE/DELETE como atribuição', icon: 'RefreshCw', section: '6.5' }
  ],
  [
    { id: 'purist', name: 'Purista Relacional', desc: 'Discrepâncias entre SQL e C. J. Date', icon: 'ShieldCheck', section: '6.6' },
    { id: 'transaction', name: 'Mestre ACID', desc: 'Atomicidade e Rollbacks de segurança', icon: 'Zap', section: 'Transações' },
    { id: 'select', name: 'Operador Relacional', desc: 'Consultas e junções rigorosas', icon: 'Code', section: 'SQL/DML' }
  ]
];

// Mapeamento dos 15 nós do Mapa Overworld
export const MAP_NODES = Array.from({ length: 15 }, (_, i) => {
  const nodeNum = i + 1;
  const isBadgeNode = [3, 6, 9, 12, 15].includes(nodeNum);
  let badgeId = null;
  if (nodeNum === 3) badgeId = 'tuples';
  if (nodeNum === 6) badgeId = 'degree';
  if (nodeNum === 9) badgeId = 'atomic';
  if (nodeNum === 12) badgeId = 'relvars';
  if (nodeNum === 15) badgeId = 'purist';

  return {
    id: nodeNum,
    label: nodeNum === 1 ? 'START' : nodeNum === 15 ? 'FINISH' : `Nó ${nodeNum}`,
    isBadgeNode,
    badgeId
  };
});

// Cartas de Sabotagem com Preços em Créditos (PTS)
export const SABOTAGE_CARDS = [
  {
    id: 'TIMEOUT',
    name: 'Tempo Curto',
    subtitle: 'TIMEOUT',
    cost: 600,
    desc: 'Reduz o tempo de resposta do rival em 15s (de 30s para apenas 15s).',
    icon: 'Clock',
    color: 'amber'
  },
  {
    id: 'RELATIONAL_OVERLOAD',
    name: 'Depuração Relacional',
    subtitle: 'AJUDA 50/50',
    cost: 800,
    desc: 'Elimina 1 alternativa incorreta da pergunta atual para a sua equipe.',
    icon: 'Sparkles',
    color: 'pink',
    isHelp: true
  },
  {
    id: 'PARALLEL_LOCK',
    name: 'Bloqueio Paralelo',
    subtitle: 'DEADLOCK',
    cost: 1000,
    desc: 'Congela a transação rival (Deadlock), forçando a pular o turno.',
    icon: 'Lock',
    color: 'cyan'
  }
];
