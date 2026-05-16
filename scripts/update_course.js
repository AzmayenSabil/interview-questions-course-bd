#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'course.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ─── Utilities ────────────────────────────────────────────────────────────────

function stripMarkdown(text) {
  return text
    .replace(/<details[\s\S]*?<\/details>/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_]{1,3}([^*_\n]+)[*_]{1,3}/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function trimWords(s, maxLen) {
  if (s.length <= maxLen) return s;
  const cut = s.lastIndexOf(' ', maxLen);
  return cut > 0 ? s.substring(0, cut) + '…' : s.substring(0, maxLen) + '…';
}

// ─── Title Generation ─────────────────────────────────────────────────────────

function generateTitle(content) {
  const text = stripMarkdown(content);
  let m;

  // MCQ entries
  if (/^MCQs? on /i.test(text))
    return trimWords(text.replace(/^MCQs? on /i, 'MCQ Round: '), 80);

  // "What is the difference between X and Y?"
  if ((m = text.match(/^What is the difference between (.+?) and (.+?)(?:\?|\.| in |$)/i))) {
    const [a, b] = [m[1].trim(), m[2].trim()];
    if (a.length < 50 && b.length < 50) return `${cap(a)} vs ${cap(b)}`;
  }

  // "What is/are X?"
  if ((m = text.match(/^What (?:is|are) (?:the |a |an |your )?(.+?)(?:\?|\.|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return cap(s);
  }

  // "What does/do X?"
  if ((m = text.match(/^What (?:does|do) (.+?)(?:\?|\.|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return cap(s);
  }

  // "How does X work?" — only append "Works" when the word "work" is in the question
  if ((m = text.match(/^How (?:does |do |to )?(.+?) works?(?:\?|\.|\s*$)/i))) {
    const s = m[1].trim();
    if (s.length < 80) return `How ${s} Works`;
  }

  // "How do/does/to/is X?" — general how-question
  if ((m = text.match(/^How (?:does |do |to |is |are |would you )?(.+?)(?:\?|\.|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return cap(`How ${s}`);
  }

  // "Explain/Describe/Discuss/Define X"
  if ((m = text.match(/^(?:Explain|Describe|Discuss|Define) (?:the |a |an )?(.+?)(?:\.|,|\?|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return cap(s);
  }

  // "Why X?"
  if ((m = text.match(/^Why (?:is |are |does |do |would |should |shouldn't |don't |won't |are not )?(.+?)(?:\?|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return `Why ${s}`;
  }

  // "When X?"
  if ((m = text.match(/^When (?:is |are |does |do |would |should )?(.+?)(?:\?|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return `When ${s}`;
  }

  // "Which X?" (MCQ-style)
  if ((m = text.match(/^Which (?:of the (?:following|given|options?) )?(.+?)(?:\?|\s*$)/i))) {
    const s = m[1].trim().replace(/\?$/, '');
    if (s.length < 80) return cap(s);
  }

  // "Design X"
  if ((m = text.match(/^Design (?:a |an |the |basic |simple )?(.+?)(?:\.|,|\s*$)/i)))
    return 'System Design: ' + cap(trimWords(m[1].trim(), 60));

  // "Draw X diagram"
  if ((m = text.match(/^Draw (?:a |the )?(.+?) (?:class |ER |entity[\-–]relationship |UML )?diagram/i)))
    return cap(m[1].trim()) + ' Diagram';

  // "Implement/Write/Build/Create/Print/Find/Calculate X"
  if ((m = text.match(/^(?:Implement(?:ation of)?|Write|Build|Create|Develop|Print|Compute|Find|Calculate) (?:a |an |the )?(.+?)(?:\.|,|\s*$)/i))) {
    const s = m[1].trim();
    if (s.length < 80) return cap(s);
  }

  // "Tell me/us about yourself"
  if (/^(?:Tell (?:me|us)|Please tell (?:me|us)) about yourself/i.test(text))
    return 'Tell Me About Yourself';
  if ((m = text.match(/^(?:Tell (?:me|us)|Please tell (?:me|us)) about (.+?)(?:\?|\.|\s*$)/i)))
    return `About ${cap(m[1].trim())}`;

  // "Can you X?"
  if ((m = text.match(/^Can you (.+?)(?:\?|\s*$)/i)))
    return cap(m[1].trim().replace(/\?$/, ''));

  // "Please X"
  if ((m = text.match(/^Please (?:tell|explain|describe|tell us about|tell me about) (?:us|me)? ?(?:about )?(.+?)(?:\?|\.|\s*$)/i)))
    return cap(m[1].trim().replace(/\?$/, ''));

  // "A X problem (hint)" type
  if ((m = text.match(/^A (.+?) problem(?:\s*[-–(](.+?)[)-])?/i))) {
    const base = m[1].trim();
    const hint = m[2] ? ` — ${m[2].trim()}` : '';
    return cap(`${base} Problem${hint}`);
  }

  // "Coding problems from X"
  if ((m = text.match(/^Coding problems? from (.+?)(?:\.|,|\s*$)/i)))
    return `Coding Problems: ${cap(m[1].trim())}`;

  // "Solve X"
  if ((m = text.match(/^Solve (.+?)(?:\.|,|\s*$)/i)))
    return cap(m[1].trim());

  // Given / algorithmic problems
  if (/^Given/i.test(text)) {
    const sentences = text.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 5);
    for (const s of sentences) {
      if ((m = s.match(/^(Find|Count|Determine|Compute|Calculate|Return|Check|Sort|Print|Output|Maximize|Minimize|Build|Generate|Identify|Construct)\s+(.+)/i))) {
        const obj = m[2].trim();
        if (obj.length < 100) return `${cap(m[1])} ${obj}`;
      }
    }
    if ((m = text.match(/For each .+?, (?:find|determine|compute|calculate|output|print) (.+?)(?:\.|,|\s*$)/i)))
      return `Find ${cap(m[1].trim())}`;
    if ((m = text.match(/(?:task is to|you (?:need to|must|should)) (.+?)(?:\.|,|\s*$)/i)))
      return cap(m[1].trim());
    if (sentences.length >= 2 && sentences[1].length < 120) return cap(sentences[1]);
    return trimWords(cap(text), 100);
  }

  // Default: first line/sentence
  const first = text.split(/[.!?\n]/)[0].trim();
  if (first.length > 5) return trimWords(cap(first), 100);
  return trimWords(cap(text), 100);
}

// ─── Curated per-question titles (vague / placeholder entries) ────────────────

const manualTitles = {
  'q-0003': 'MCQ Round: OOP, Logic & Frameworks',
  'q-0004': 'Coding Round: LeetCode Easy–Medium Problems',
  'q-0005': 'How CI/CD Pipelines Work',
  'q-0008': 'Past Project: Architecture-Level Decisions',
  'q-0009': "Case-Insensitive 'YES' String Check",
  'q-0010': 'Find Earliest Connection Time for All Students Per Game',
  'q-0021': 'Find Lexicographically Smallest String via Reverse Sliding Window',
  'q-0025': 'String Manipulation Warm-Up Problems',
  'q-0026': 'System Design: Feature API Design',
  'q-0027': 'MCQ Round: JavaScript, C/C++ & Database Concepts',
  'q-0028': 'Improving a DP Solution',
  'q-0031': 'Long-Term Commitment: 3-Year Interview Question',
  'q-0032': 'System Design: Basic Search Engine',
  'q-0034': 'DP Variant: 0/1 Knapsack',
  'q-0035': 'How a Trie Works: Concepts and Implementation',
  'q-0037': 'System Design: Music Streaming API (Spotify-style)',
  'q-0038': 'SQL Query Design: Top 10 Songs of the Month',
  'q-0042': 'Array Pop Utility Function (Conditional Pop)',
  'q-0046': 'Remove Duplicates from Linked List',
  'q-0049': 'Reverse a Linked List',
  'q-0062': 'Black and Red Balls: Ratio Problem',
  'q-0065': 'Predict the Output (C Operator Precedence)',
  'q-0071': 'The static Keyword in Class Methods',
  'q-0077': 'Remove Nth Node from End of Circular Linked List',
  'q-0078': 'Find Lowest Common Ancestor (LCA) in a BST',
  'q-0080': 'MCQ: Modelling Many-to-Many Relationships',
  'q-0083': 'MCQ: Which Statement about DP is False?',
  'q-0085': 'MCQ: When Is a Stack Most Appropriate?',
  'q-0093': 'SQL: Retrieve Customers with Orders Over $1,000',
  'q-0100': 'Print the Factorial of N',
  'q-0102': 'Count Numbers Matching Specific Conditions',
  'q-0106': 'Icebreaker: Favourite Food Discussion',
  'q-0107': 'Icebreaker: Favourite Actor Discussion',
  'q-0108': 'Self-Awareness: When Do You Feel Sad?',
  'q-0109': 'Describe Your Favourite Personal Project',
  'q-0116': 'The Four Pillars of OOP',
  'q-0142': 'Topological Sort from Letter Orderings',
  'q-0143': 'Add Two Large Numbers Represented as Character Arrays',
  'q-0153': 'Find Middle Element k Where Prefix Sum Equals Suffix Sum',
  'q-0155': 'ACID Properties in Databases',
  'q-0156': 'The static Keyword in Java/C++',
  'q-0158': 'Authentication vs Authorization',
  'q-0171': 'Two-Pointer Array Output Simulation',
  'q-0177': 'Print All Repeating Elements in an Array',
  'q-0185': 'Priority Queue: Internal Working & Implementation',
  'q-0198': 'Binary Search Tree (BST): Concepts & Usage',
  'q-0203': 'The JavaScript Event Loop',
  'q-0204': 'Closures in JavaScript',
  'q-0206': 'Why You Should Not Mutate Props in React',
  'q-0216': 'Functional Programming Philosophy',
  'q-0259': 'Find All Primes in a Range [L, R]',
  'q-0268': 'Reconstruct Array from Unsorted Indices',
  'q-0270': 'Minimum Merge Operations to Make Array a Palindrome',
  'q-0286': 'Permutation Self-Composition: a[a[i]] Operation',
  'q-0296': 'Boats to Save People (Two-Pointer Greedy)',
  'q-0309': 'Getters and Setters in Java',
  'q-0312': 'Word-Wrapped Text Formatting',
  'q-0313': 'The Four Pillars of OOP (with Examples)',
  'q-0317': 'The Agile Model in Software Engineering',
  'q-0318': 'The SOLID Principles',
  'q-0319': 'TCP vs UDP Protocol Differences',
  'q-0322': 'Tell Me About Yourself',
  'q-0324': 'Singleton Design Pattern: Code & Explanation',
  'q-0325': 'The Four Pillars of OOP: Code Examples',
  'q-0352': 'Find the 10 Smallest Elements from 1,000 Unsorted Numbers',
  'q-0364': 'Class Diagram: Course Management System',
  'q-0371': 'Cluster Detection: Count Groups of Intersecting Circles',
  'q-0376': 'Heap Data Structure and Heap Sort',
  'q-0377': 'AVL Tree: Self-Balancing BST',
  'q-0378': 'Reverse a Singly Linked List',
  'q-0380': 'RAID Levels 0–5 Explained',
  'q-0381': 'Why Disk I/O Time Increases with Small Chunk Sizes',
  'q-0396': 'System Design: ERD for Online Restaurant Management',
  'q-0397': 'Database Transactions',
  'q-0399': 'Normalisation vs Denormalisation in Databases',
  'q-0400': 'Boyce–Codd Normal Form (BCNF)',
  'q-0401': 'Data Warehousing: Concepts and Use Cases',
  'q-0402': 'Data Redundancy and Its Problems',
  'q-0408': 'Find All Divisors of N',
  'q-0410': 'SQL Query: Classify Binary Tree Nodes (Leaf, Root, Inner)',
  'q-0415': 'Maximum Profit: Best Time to Buy and Sell Stock',
  'q-0441': 'OOP System Design: Parking Management System',
  'q-0456': 'TCP vs UDP: Protocol Differences',
  'q-0465': 'File Permissions in Linux',
  'q-0470': 'Principles of OOP',
  'q-0471': 'Types of Relationships in Databases',
  'q-0472': 'Binary Search: Concept and Implementation',
  'q-0487': 'GRE-Style Math Problem',
  'q-0495': 'Triggers and Cascading in DBMS',
  'q-0504': 'Threading in the Context of OOP',
  'q-0505': 'Detecting Changes in a Database',
  'q-0510': 'Key Features of Spring Boot',
  'q-0511': 'JWT Tokens: Structure and Parts',
  'q-0514': 'Key Concepts of OOP',
  'q-0516': 'Spring Boot: Core Features Overview',
  // aptitude
  'q-0017': 'Determine Valid Pigment Assignment for Unique Grid Values',
  'q-0023': 'Probability of Page Number Containing a Secret Digit',
  // arrays-strings
  'q-0012': 'Find Shortest Unique Identifying Substring per Phone Number',
  'q-0015': 'Determine Valid Fragment Sequence in Circular String',
  // stack-queue
  'q-0060': 'Browser Navigation: Choosing the Right Data Structure',
  'q-0076': 'Circular Queue Remaining Capacity Calculation',
  // trees-graphs
  'q-0022': 'Count Vertices That Lie on or Can Reach a Cycle',
  'q-0029': 'How to Avoid Hash Table Collisions',
  // dynamic-programming
  'q-0014': 'Minimise Score Difference by Optimally Incrementing Item Costs',
  // database
  'q-0055': 'Database Normalisation: Concepts and Benefits',
  // os-networking
  'q-0007': 'Mobile Application Lifecycle',
  'q-0039': 'Email Address Regex Validator',
  // web-frontend
  'q-0002': 'React vs Next.js',
  'q-0040': 'HTML: div vs span',
  'q-0041': 'Error Handling in Sync vs Async Node.js Code',
  // sdlc
  'q-0067': 'MCQ: Which SDLC Model Emphasises Continuous Iteration?',
  'q-0068': 'MCQ: Who Writes Unit Tests in a Software Project?',
  'q-0070': 'MCQ: Primary Purpose of a Sprint in Agile',
  // competitive programming
  'q-0011': 'Calculate Total Score with Penalties (Competitive Round)',
  'q-0013': 'Assign Dishes to Maximise Total Happiness',
  // trees-graphs
  'q-0220': 'Tree, Binary Tree, and BST — Balancing Imbalanced Trees',
  // os-networking
  'q-0454': 'What Is a Port? Common Service Ports',
  'q-0461': 'What Is a Shell? Common Shell Examples',
  // behavioral
  'q-0030': 'What Is Your Biggest Weakness?',
  'q-0125': 'Tell Me About Yourself',
  // misc
  'q-0184': 'Depth-First Search (DFS): Concepts and Implementation',
  'q-0211': 'JavaScript: var, let, and const Explained',
  'q-0221': 'Map vs unordered_map: Complexity Analysis',
  'q-0519': 'Method Overloading vs Method Overriding',
};

// ─── Improved topic descriptions ──────────────────────────────────────────────

const topicDescriptions = {
  'career-prep': 'Build a strong professional presence: craft a standout resume, optimise your LinkedIn profile, assemble a portfolio, apply to jobs strategically, and evaluate companies before accepting an offer.',
  'aptitude': 'Sharpen your analytical thinking with brain teasers, ratio problems, probability puzzles, sequence questions, and logical reasoning — the type commonly tested in aptitude and IQ screening rounds.',
  'arrays-strings': 'Master array manipulation, string processing, matrix traversal, sliding window, two-pointer patterns, and classic interview problems such as anagram detection, palindromes, and Roman numeral conversion.',
  'linked-list': 'Work through singly and doubly linked list problems: reversal, duplicate removal, detecting and removing cycles, nth-from-end deletion, and merging sorted lists using pointer techniques.',
  'stack-queue': 'Explore stack and queue structures through problems on parenthesis matching, monotonic stacks, circular queues, deque operations, and classic design challenges like implementing a browser history.',
  'sorting-searching': 'Cover fundamental and advanced algorithms — merge sort, heap sort, counting sort, topological sort, and binary search — alongside order-statistics and efficient lookup strategies.',
  'trees-graphs': "Dive into binary trees, BSTs, heaps, tries, hash tables, and graph algorithms: BFS, DFS, Dijkstra's shortest path, minimum spanning trees, LCA, cycle detection, and connected components.",
  'dynamic-programming': 'Tackle classic DP patterns: 0/1 knapsack, unbounded knapsack, longest common subsequence, coin change, profit maximisation, memoisation, and bottom-up tabulation strategies.',
  'oop': 'Master object-oriented programming — the four pillars (encapsulation, inheritance, polymorphism, abstraction), SOLID principles, common design patterns (Singleton, Factory, Observer), and type casting.',
  'database': 'Cover SQL queries and joins, schema design, ER diagrams, normalisation (1NF through BCNF), ACID properties, indexing, transactions, triggers, NoSQL trade-offs, and data warehousing concepts.',
  'system-design': 'Learn to design scalable, production-ready systems: REST APIs, CRUD applications, microservices architecture, caching strategies, message queues, load balancing, and high-level trade-off discussions.',
  'os-networking': 'Study operating system fundamentals (processes, threads, scheduling, deadlocks, virtual memory) alongside networking concepts (HTTP/HTTPS, TCP/UDP, DNS, sockets, firewalls, and Linux commands).',
  'web-frontend': 'Explore JavaScript in depth (closures, event loop, async/await, prototypes), React and Next.js, Node.js, HTML/CSS semantics, responsive design, and modern frontend engineering best practices.',
  'sdlc': 'Understand the full software development lifecycle: Agile, Scrum, Kanban, Waterfall models, sprint planning, CI/CD pipelines, unit and integration testing, code review, and engineering best practices.',
  'competitive-programming': 'Solve contest-style algorithmic challenges covering graph theory, union-find, greedy strategies, combinatorics, number theory, and real problems from competitive programming rounds.',
  'behavioral': 'Prepare for HR and behavioural interviews with questions on self-introduction, strengths and weaknesses, teamwork scenarios, conflict resolution, motivation, and long-term career goals.',
  'misc': 'A curated mix of general software engineering questions spanning multiple languages and domains — output prediction, language-specific behaviour (Java, C++, JS), architecture diagrams, and open-ended design prompts.',
};

// ─── Misclassification fixes ──────────────────────────────────────────────────

const reclassify = {
  'q-0441': 'oop',   // OOP parking system design — was in arrays-strings
  'q-0309': 'oop',   // Getters and setters in Java — was in os-networking
  'q-0324': 'oop',   // Singleton pattern — was in os-networking
  'q-0005': 'sdlc',  // How CI/CD pipelines work — was in os-networking
};

// ─── Apply updates ────────────────────────────────────────────────────────────

const movedQuestions = [];

data.topics.forEach(t => {
  t.description = topicDescriptions[t.id] ?? t.description;

  t.questions.forEach(q => {
    q.title = manualTitles[q.id] ?? generateTitle(q.content);

    if (reclassify[q.id]) {
      movedQuestions.push({ question: q, from: q.topic, to: reclassify[q.id] });
      q.topic = reclassify[q.id];
    }
  });
});

movedQuestions.forEach(({ question, from, to }) => {
  const src = data.topics.find(t => t.id === from);
  if (src) src.questions = src.questions.filter(q => q.id !== question.id);
  const dst = data.topics.find(t => t.id === to);
  if (dst) dst.questions.push(question);
});

data.stats.totalQuestions = data.topics.reduce((sum, t) => sum + t.questions.length, 0);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log(`Done. ${data.stats.totalQuestions} questions updated.`);
movedQuestions.forEach(({ question, from, to }) => {
  console.log(`  Moved ${question.id} "${question.title}": ${from} → ${to}`);
});

// Spot-check
const checks = ['q-0046','q-0049','q-0028','q-0034','q-0071','q-0021','q-0010','q-0062',
                 'q-0198','q-0441','q-0005','q-0003','q-0027','q-0309','q-0065','q-0100'];
console.log('\nSpot-check titles:');
data.topics.forEach(t => {
  t.questions.forEach(q => {
    if (checks.includes(q.id)) console.log(`  [${q.topic}] ${q.id}: ${q.title}`);
  });
});
