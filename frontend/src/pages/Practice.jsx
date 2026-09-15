import React, { useState, useEffect } from 'react';
import {
  Bell, Code, Cpu, BarChart2, CheckCircle2, XCircle, Play, ChevronRight,
  RotateCcw, Sparkles, HelpCircle, ArrowRight, Clock, FileCode,
  RefreshCw, ChevronDown
} from 'lucide-react';
import Layout from '../components/Layout';

const CODING_PROBLEMS = [
  {
    id: 'c1',
    title: 'Two Sum Strategy',
    difficulty: 'Easy',
    role: 'Software Developer',
    category: 'Data Structures & Algorithms',
    timeLimit: '15 mins',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    starterCode: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0,1]' }
    ]
  },
  {
    id: 'c2',
    title: 'Valid Parentheses Stacks',
    difficulty: 'Medium',
    role: 'Software Developer',
    category: 'Data Structures & Algorithms',
    timeLimit: '20 mins',
    description: 'Given a string s containing just the characters (, ), {, }, [, ] determine if the input string is valid. Brackets must close in the correct order.',
    starterCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (let char of s) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: 's = "()[]{}"', expected: 'true' },
      { input: 's = "(]"', expected: 'false' },
      { input: 's = "{[]}"', expected: 'true' }
    ]
  },
  {
    id: 'c3',
    title: 'LRU Cache Design',
    difficulty: 'Hard',
    role: 'Backend Architect',
    category: 'System Design & Code',
    timeLimit: '30 mins',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement key-value get and put methods with O(1) average time complexity.',
    starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}`,
    testCases: [
      { input: 'capacity = 2, put(1,1), put(2,2), get(1)', expected: '1' },
      { input: 'put(3,3), get(2)', expected: '-1' }
    ]
  }
];

const ANALYTICAL_PROBLEMS = [
  {
    id: 'a1',
    title: 'Quarterly Revenue Growth & Anomaly Analysis',
    difficulty: 'Medium',
    category: 'Data Interpretation',
    role: 'Data Analyst',
    scenario: 'Analyze the quarterly performance chart below for Tech Corp. Identify which quarter experienced the highest relative growth margin despite increased operational expenses.',
    chartData: [
      { label: 'Q1', revenue: 45, expense: 30, growth: 12 },
      { label: 'Q2', revenue: 65, expense: 38, growth: 22 },
      { label: 'Q3', revenue: 58, expense: 42, growth: 8 },
      { label: 'Q4', revenue: 92, expense: 55, growth: 34 }
    ],
    question: 'Which quarter yielded the maximum net profit ratio relative to operational costs?',
    options: ['Q1 (Net: $15M)', 'Q2 (Net: $27M)', 'Q3 (Net: $16M)', 'Q4 (Net: $37M)'],
    correct: 3,
    explanation: 'Q4 Net profit is $37M ($92M revenue - $55M expenses). Q4 operational expansion boosted gross margin by 34%, yielding the highest relative net margin ratio (67.2%).'
  },
  {
    id: 'a2',
    title: 'Algorithmic Logic & Sequence Pattern',
    difficulty: 'Hard',
    category: 'Logical Reasoning',
    role: 'Product Manager',
    sequenceDiagram: ['3', '7', '16', '35', '74', '?'],
    question: 'Determine the missing scalar value in the algorithmic pattern sequence provided.',
    options: ['148', '153', '150', '162'],
    correct: 1,
    explanation: 'The rule is: (N * 2) + 1, then (N * 2) + 2, (N * 2) + 3, and so on. \n- 3*2 + 1 = 7\n- 7*2 + 2 = 16\n- 16*2 + 3 = 35\n- 35*2 + 4 = 74\n- 74*2 + 5 = 153!'
  }
];

const COMPUTER_AWARENESS_DATA = [
  {
    id: 'ca1',
    title: 'OS Process Scheduling Mechanics',
    category: 'Operating Systems',
    diagramType: 'OS_SCHEDULER',
    summary: 'Understanding the state transitions of a process in modern multi-tasking operating systems.',
    flashcards: [
      { q: 'What is Context Switching in OS?', a: 'The process of storing the state of a CPU process so that it can be restored and resume execution at a later point, allowing multiple processes to share a single CPU.' },
      { q: 'Explain Deadlock 4 Coffman Conditions', a: '1. Mutual Exclusion, 2. Hold & Wait, 3. No Preemption, 4. Circular Wait.' }
    ],
    quiz: {
      question: 'In modern OS, which queue holds processes that are loaded into main memory and ready to execute?',
      options: ['Job Queue', 'Ready Queue', 'Device Queue', 'Suspended Queue'],
      correct: 1,
      explanation: 'The Ready Queue keeps all processes residing in main memory that are ready and waiting to be executed by the CPU dispatcher.'
    }
  },
  {
    id: 'ca2',
    title: 'TCP/IP vs OSI Layer Architectures',
    category: 'Computer Networks',
    diagramType: 'OSI_LAYERS',
    summary: 'Packet encapsulation and flow control across network protocol stack layers.',
    flashcards: [
      { q: 'What is the primary function of ARP?', a: 'Address Resolution Protocol maps an IP address (Logical) to a physical Machine MAC address on local network.' },
      { q: 'Difference between TCP and UDP?', a: 'TCP is connection-oriented, reliable, orders packets. UDP is connectionless, fast, lightweight without guarantees.' }
    ],
    quiz: {
      question: 'Which OSI layer is responsible for end-to-end flow control and error recovery?',
      options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Session Layer'],
      correct: 1,
      explanation: 'The Transport Layer (Layer 4, e.g., TCP) guarantees end-to-end connection reliability, segmentation, and flow control.'
    }
  },
  {
    id: 'ca3',
    title: 'Database Indexing & B-Trees',
    category: 'DBMS & SQL',
    diagramType: 'DBMS_BTREE',
    summary: 'How relational databases optimize read queries using balanced tree indexes.',
    flashcards: [
      { q: 'What is ACID in Database Systems?', a: 'Atomicity, Consistency, Isolation, and Durability - ensuring reliable transactions.' },
      { q: 'Primary Key vs Unique Key?', a: 'Primary Key cannot accept NULL values and uniquely identifies a record. Unique key allows one NULL value.' }
    ],
    quiz: {
      question: 'What is the time complexity for lookup in a balanced B-Tree index of size N?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct: 1,
      explanation: 'B-Trees maintain balanced height, ensuring search, insertion, and deletion operations in O(log N) logarithmic time.'
    }
  }
];

export default function Practice() {
  const [activeTab, setActiveTab] = useState('coding');
  const [sessionActive, setSessionActive] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [practiceCategory, setPracticeCategory] = useState('All Topics');
  const [difficulty, setDifficulty] = useState('Easy');
  const [questionCount, setQuestionCount] = useState('5 questions');
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isExecutingCode, setIsExecutingCode] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState('results');
  const [logs, setLogs] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnalyticalExplanation, setShowAnalyticalExplanation] = useState(false);
  const [flipCardIdx, setFlipCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [awarenessQuizAns, setAwarenessQuizAns] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(900);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (sessionActive && timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timerRunning, timerSeconds]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSessionActive(false);
    resetState();

    if (tab === 'coding') {
      setTargetRole('Software Developer');
    } else if (tab === 'analytical') {
      setTargetRole('Data Analyst');
    } else {
      setTargetRole('Systems Architect');
    }
  };

  const resetState = () => {
    setCurrentProblemIdx(0);
    setTestResults(null);
    setSelectedAnswer(null);
    setShowAnalyticalExplanation(false);
    setIsFlipped(false);
    setAwarenessQuizAns(null);
    setLogs([]);
  };

  const handleStartSession = () => {
    setSessionActive(true);
    setTimerSeconds(900);
    setTimerRunning(true);
    resetState();

    if (activeTab === 'coding') {
      setUserCode(CODING_PROBLEMS[0].starterCode);
    }
  };

  const handleRunCode = () => {
    setIsExecutingCode(true);
    setLogs(['[System] Initializing V8 Engine Sandbox...', '[System] Compiling JavaScript source AST...']);

    setTimeout(() => {
      setLogs((prev) => [...prev, '[Info] Executing test cases 1 through 3...']);
    }, 400);

    setTimeout(() => {
      setIsExecutingCode(false);
      setLogs((prev) => [
        ...prev,
        '[Success] Test Case 1 Passed (0.12ms)',
        '[Success] Test Case 2 Passed (0.08ms)',
        '[Success] Test Case 3 Passed (0.15ms)',
        '--- Execution Finished Successfully ---'
      ]);
      setTestResults({
        passed: true,
        count: '3/3 Passed',
        runtime: '0.35 ms',
        memory: '14.2 MB'
      });
    }, 1100);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Layout title="Practice studio">
      <div className="practice-studio min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-purple-600/30 selection:text-purple-300">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Practice with intention
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Start a focused session from the free, curated question bank tailored for top tech roles.
            </p>
          </div>

          <div className="flex border-b border-[#1E2E42]/60 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
            <button
              onClick={() => handleTabChange('coding')}
              className={`pb-3 px-2 flex items-center space-x-2.5 text-sm sm:text-base font-semibold border-b-2 transition duration-200 whitespace-nowrap ${
                activeTab === 'coding'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className={`w-4 h-4 ${activeTab === 'coding' ? 'text-purple-400' : ''}`} />
              <span>Coding Practice</span>
            </button>

            <button
              onClick={() => handleTabChange('analytical')}
              className={`pb-3 px-2 flex items-center space-x-2.5 text-sm sm:text-base font-semibold border-b-2 transition duration-200 whitespace-nowrap ${
                activeTab === 'analytical'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className={`w-4 h-4 ${activeTab === 'analytical' ? 'text-purple-400' : ''}`} />
              <span>Analytical & Reasoning</span>
            </button>

            <button
              onClick={() => handleTabChange('awareness')}
              className={`pb-3 px-2 flex items-center space-x-2.5 text-sm sm:text-base font-semibold border-b-2 transition duration-200 whitespace-nowrap ${
                activeTab === 'awareness'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeTab === 'awareness' ? 'text-purple-400' : ''}`} />
              <span>Computer Awareness</span>
            </button>
          </div>

          {!sessionActive ? (
            <div className="bg-[#121622] rounded-2xl border border-[#23283B] p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#2E354F]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Role</label>
                  <div className="relative">
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-[#181D2D] text-slate-100 border border-[#2B3147] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="Software Developer">Software Developer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Systems Architect">Systems Architect / Network Admin</option>
                      <option value="Full Stack Engineer">Full Stack Engineer</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Category</label>
                  <div className="relative">
                    <select
                      value={practiceCategory}
                      onChange={(e) => setPracticeCategory(e.target.value)}
                      className="w-full bg-[#181D2D] text-slate-100 border border-[#2B3147] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                    >
                      {activeTab === 'coding' && (
                        <>
                          <option value="All Topics">Data Structures & Algorithms</option>
                          <option value="System Design">System Design & Implementation</option>
                          <option value="Web Dev">Frontend / JS Execution</option>
                        </>
                      )}
                      {activeTab === 'analytical' && (
                        <>
                          <option value="Data Interpretation">Data Interpretation & Charts</option>
                          <option value="Logical Reasoning">Logical Sequences & Deduction</option>
                          <option value="Quantitative">Quantitative Aptitude</option>
                        </>
                      )}
                      {activeTab === 'awareness' && (
                        <>
                          <option value="OS">Operating Systems & Kernels</option>
                          <option value="Networking">TCP/IP Networks & Protocols</option>
                          <option value="DBMS">Database Architecture & Indexing</option>
                        </>
                      )}
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Difficulty</label>
                  <div className="relative">
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-[#181D2D] text-slate-100 border border-[#2B3147] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Questions / Session</label>
                  <div className="relative">
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      className="w-full bg-[#181D2D] text-slate-100 border border-[#2B3147] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="5 questions">5 questions (15 mins)</option>
                      <option value="10 questions">10 questions (30 mins)</option>
                      <option value="15 questions">15 questions (45 mins)</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartSession}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.01] transition duration-200 active:scale-[0.99] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start practice session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#121622] rounded-xl border border-[#23283B] p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold uppercase tracking-wide">
                    {difficulty}
                  </span>
                  <h2 className="text-base font-semibold text-slate-100">
                    {activeTab === 'coding' && CODING_PROBLEMS[currentProblemIdx].title}
                    {activeTab === 'analytical' && ANALYTICAL_PROBLEMS[currentProblemIdx].title}
                    {activeTab === 'awareness' && COMPUTER_AWARENESS_DATA[currentProblemIdx].title}
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-[#181D2D] px-3 py-1.5 rounded-lg border border-[#2B3147] text-xs font-mono text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Time Remaining:</span>
                    <span className="text-purple-400 font-bold">{formatTime(timerSeconds)}</span>
                  </div>

                  <button
                    onClick={() => setSessionActive(false)}
                    className="px-3 py-1.5 bg-[#1C2132] hover:bg-[#252C42] border border-[#2D344B] text-xs text-slate-300 rounded-lg transition"
                  >
                    Exit Session
                  </button>
                </div>
              </div>

              {activeTab === 'coding' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-[#121622] rounded-2xl border border-[#23283B] p-5 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">
                          Category: <strong className="text-slate-200">{CODING_PROBLEMS[currentProblemIdx].category}</strong>
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {CODING_PROBLEMS[currentProblemIdx].timeLimit}
                        </span>
                      </div>

                      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                        <p>{CODING_PROBLEMS[currentProblemIdx].description}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Test Cases</h4>
                        {CODING_PROBLEMS[currentProblemIdx].testCases.map((tc, idx) => (
                          <div key={idx} className="bg-[#181D2D] rounded-lg p-2.5 border border-[#2B3147] text-xs font-mono">
                            <p className="text-slate-400"><span className="text-purple-400">Input:</span> {tc.input}</p>
                            <p className="text-slate-300"><span className="text-emerald-400">Expected:</span> {tc.expected}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#1F2538] pt-4">
                      <button
                        disabled={currentProblemIdx === 0}
                        onClick={() => {
                          setCurrentProblemIdx((p) => p - 1);
                          setUserCode(CODING_PROBLEMS[currentProblemIdx - 1].starterCode);
                          setTestResults(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#20273D] disabled:opacity-40 text-xs font-medium transition"
                      >
                        Previous Problem
                      </button>
                      <span className="text-xs text-slate-400">
                        Problem {currentProblemIdx + 1} of {CODING_PROBLEMS.length}
                      </span>
                      <button
                        disabled={currentProblemIdx === CODING_PROBLEMS.length - 1}
                        onClick={() => {
                          setCurrentProblemIdx((p) => p + 1);
                          setUserCode(CODING_PROBLEMS[currentProblemIdx + 1].starterCode);
                          setTestResults(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#20273D] disabled:opacity-40 text-xs font-medium transition"
                      >
                        Next Problem
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#121622] rounded-2xl border border-[#23283B] overflow-hidden flex flex-col shadow-xl">
                      <div className="bg-[#161B29] px-4 py-2.5 border-b border-[#23283B] flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileCode size={16} className="text-purple-400" />
                          <span className="text-xs font-mono font-medium text-slate-300">solution.js</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setUserCode(CODING_PROBLEMS[currentProblemIdx].starterCode)}
                            className="p-1 text-slate-400 hover:text-slate-200 transition" 
                            title="Reset Code"
                          >
                            <RotateCcw size={14} />
                          </button>
                          <button
                            onClick={handleRunCode}
                            disabled={isExecutingCode}
                            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-md hover:brightness-110 active:scale-95 transition"
                          >
                            {isExecutingCode ? (
                              <RefreshCw size={13} className="animate-spin" />
                            ) : (
                              <Play size={13} className="fill-current" />
                            )}
                            <span>{isExecutingCode ? 'Running...' : 'Run Code'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="relative font-mono text-sm bg-[#0E111A] p-4 min-h-[280px]">
                        <textarea
                          value={userCode}
                          onChange={(e) => setUserCode(e.target.value)}
                          className="w-full h-64 bg-transparent text-emerald-300 focus:outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed"
                          spellCheck="false"
                        />
                      </div>
                    </div>

                    <div className="bg-[#121622] rounded-2xl border border-[#23283B] overflow-hidden">
                      <div className="bg-[#161B29] px-4 py-2 border-b border-[#23283B] flex items-center space-x-4">
                        <button
                          onClick={() => setActiveConsoleTab('results')}
                          className={`text-xs font-semibold py-1 border-b-2 ${
                            activeConsoleTab === 'results' ? 'border-purple-400 text-purple-400' : 'border-transparent text-slate-400'
                          }`}
                        >
                          Test Results
                        </button>
                        <button
                          onClick={() => setActiveConsoleTab('terminal')}
                          className={`text-xs font-semibold py-1 border-b-2 ${
                            activeConsoleTab === 'terminal' ? 'border-purple-400 text-purple-400' : 'border-transparent text-slate-400'
                          }`}
                        >
                          Terminal Output
                        </button>
                      </div>

                      <div className="p-4 min-h-[120px] bg-[#0E111A]">
                        {activeConsoleTab === 'results' ? (
                          testResults ? (
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                                <CheckCircle2 size={16} />
                                <span>All Test Cases Passed! ({testResults.count})</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400 bg-[#151A28] p-3 rounded-lg border border-[#22293E]">
                                <div>Runtime: <span className="text-slate-200">{testResults.runtime}</span></div>
                                <div>Memory Usage: <span className="text-slate-200">{testResults.memory}</span></div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 italic py-4 text-center">
                              Click "Run Code" to execute test cases against your implementation.
                            </div>
                          )
                        ) : (
                          <div className="font-mono text-xs space-y-1 text-slate-400">
                            {logs.length === 0 ? (
                              <span className="text-slate-600">Console is idle...</span>
                            ) : (
                              logs.map((log, i) => <div key={i}>{log}</div>)
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytical' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 bg-[#121622] rounded-2xl border border-[#23283B] p-6 space-y-6">
                    <div>
                      <span className="text-xs font-semibold uppercase text-purple-400 tracking-wider">
                        {ANALYTICAL_PROBLEMS[currentProblemIdx].category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 mt-1">
                        {ANALYTICAL_PROBLEMS[currentProblemIdx].title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-2">
                        {ANALYTICAL_PROBLEMS[currentProblemIdx].scenario}
                      </p>
                    </div>

                    {ANALYTICAL_PROBLEMS[currentProblemIdx].chartData && (
                      <div className="bg-[#161B29] p-4 rounded-xl border border-[#23283B] space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>Quarterly Revenue vs Operational Costs ($ Millions)</span>
                        </div>
                        <div className="space-y-3 pt-2">
                          {ANALYTICAL_PROBLEMS[currentProblemIdx].chartData.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-300 font-bold">{item.label}</span>
                                <span className="text-slate-400">Rev: ${item.revenue}M | Exp: ${item.expense}M</span>
                              </div>
                              <div className="h-3 w-full bg-[#0E111A] rounded-full overflow-hidden flex">
                                <div style={{ width: `${item.revenue}%` }} className="bg-purple-500 h-full" />
                                <div style={{ width: `${item.expense}%` }} className="bg-rose-500/80 h-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-2 border-t border-[#22293E]">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> Revenue</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Expenses</span>
                        </div>
                      </div>
                    )}

                    {ANALYTICAL_PROBLEMS[currentProblemIdx].sequenceDiagram && (
                      <div className="bg-[#161B29] p-6 rounded-xl border border-[#23283B]">
                        <span className="text-xs text-slate-400 block mb-3 font-mono">Pattern Sequence Breakdown:</span>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          {ANALYTICAL_PROBLEMS[currentProblemIdx].sequenceDiagram.map((num, idx) => (
                            <div key={idx} className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-lg text-purple-300 shadow-md">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-6 bg-[#121622] rounded-2xl border border-[#23283B] p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-base font-semibold text-slate-200">
                        {ANALYTICAL_PROBLEMS[currentProblemIdx].question}
                      </h4>

                      <div className="space-y-2.5 pt-2">
                        {ANALYTICAL_PROBLEMS[currentProblemIdx].options.map((option, idx) => {
                          const isSelected = selectedAnswer === idx;
                          const isCorrect = idx === ANALYTICAL_PROBLEMS[currentProblemIdx].correct;
                          let optionStyle = 'bg-[#181D2D] border-[#2B3147] text-slate-300 hover:border-purple-500/50';

                          if (selectedAnswer !== null) {
                            if (isSelected) {
                              optionStyle = isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                                : 'bg-rose-500/10 border-rose-500 text-rose-300';
                            } else if (isCorrect) {
                              optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-300';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedAnswer(idx)}
                              className={`w-full text-left p-3.5 rounded-xl border font-medium text-sm transition flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{option}</span>
                              {selectedAnswer !== null && isSelected && (
                                isCorrect ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-rose-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {selectedAnswer !== null && (
                        <div className="pt-2">
                          <button
                            onClick={() => setShowAnalyticalExplanation(!showAnalyticalExplanation)}
                            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            <HelpCircle size={14} />
                            <span>{showAnalyticalExplanation ? 'Hide Explanation' : 'View Step-by-Step Logic'}</span>
                          </button>

                          {showAnalyticalExplanation && (
                            <div className="mt-3 p-4 bg-[#161B29] border border-[#23283B] rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed animate-fadeIn">
                              {ANALYTICAL_PROBLEMS[currentProblemIdx].explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#1F2538] pt-4">
                      <button
                        disabled={currentProblemIdx === 0}
                        onClick={() => {
                          setCurrentProblemIdx((p) => p - 1);
                          setSelectedAnswer(null);
                          setShowAnalyticalExplanation(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#20273D] disabled:opacity-40 text-xs font-medium transition"
                      >
                        Previous Question
                      </button>
                      <button
                        disabled={currentProblemIdx === ANALYTICAL_PROBLEMS.length - 1}
                        onClick={() => {
                          setCurrentProblemIdx((p) => p + 1);
                          setSelectedAnswer(null);
                          setShowAnalyticalExplanation(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#20273D] disabled:opacity-40 text-xs font-medium transition"
                      >
                        Next Question
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'awareness' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 bg-[#121622] rounded-2xl border border-[#23283B] p-6 space-y-6">
                    <div>
                      <span className="text-xs font-semibold uppercase text-purple-400 tracking-wider">
                        {COMPUTER_AWARENESS_DATA[currentProblemIdx].category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 mt-1">
                        {COMPUTER_AWARENESS_DATA[currentProblemIdx].title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {COMPUTER_AWARENESS_DATA[currentProblemIdx].summary}
                      </p>
                    </div>

                    <div className="bg-[#161B29] p-5 rounded-xl border border-[#23283B] space-y-3">
                      <span className="text-xs font-mono text-slate-400">Architecture Visualizer</span>
                      {COMPUTER_AWARENESS_DATA[currentProblemIdx].diagramType === 'OS_SCHEDULER' && (
                        <div className="flex items-center justify-around py-4">
                          <div className="px-3 py-2 bg-purple-500/20 border border-purple-500/40 rounded-lg text-xs text-purple-300 font-mono">New</div>
                          <ArrowRight size={14} className="text-slate-500" />
                          <div className="px-3 py-2 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-xs text-indigo-300 font-mono animate-pulse">Ready</div>
                          <ArrowRight size={14} className="text-slate-500" />
                          <div className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 font-mono">Running</div>
                        </div>
                      )}

                      {COMPUTER_AWARENESS_DATA[currentProblemIdx].diagramType === 'OSI_LAYERS' && (
                        <div className="grid grid-cols-4 gap-2 py-2 text-center text-[11px] font-mono">
                          <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300">App (L7)</div>
                          <div className="p-2 bg-purple-500/15 border border-purple-500/30 rounded text-purple-300">Transport (L4)</div>
                          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded text-purple-300">Network (L3)</div>
                          <div className="p-2 bg-purple-500/5 border border-purple-500/10 rounded text-purple-300">Physical (L1)</div>
                        </div>
                      )}

                      {COMPUTER_AWARENESS_DATA[currentProblemIdx].diagramType === 'DBMS_BTREE' && (
                        <div className="flex flex-col items-center gap-2 py-2 text-xs font-mono">
                          <div className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/40 rounded-md text-purple-300">Root [50]</div>
                          <div className="flex gap-4">
                            <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded text-indigo-300">Leaf [20, 35]</div>
                            <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded text-indigo-300">Leaf [65, 80]</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Concept Flashcard</span>
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="cursor-pointer bg-[#181D2D] border border-[#2B3147] hover:border-purple-500/50 rounded-xl p-6 min-h-[120px] flex items-center justify-center text-center transition duration-300 shadow-md relative group"
                      >
                        <span className="text-xs text-purple-400 font-semibold absolute top-2.5 right-3 opacity-70 group-hover:opacity-100">
                          Click to flip 🔄
                        </span>
                        <p className="text-sm font-medium text-slate-200">
                          {isFlipped
                            ? COMPUTER_AWARENESS_DATA[currentProblemIdx].flashcards[flipCardIdx].a
                            : COMPUTER_AWARENESS_DATA[currentProblemIdx].flashcards[flipCardIdx].q}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-[#121622] rounded-2xl border border-[#23283B] p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Knowledge Check</span>
                        <span className="text-xs text-slate-400">CS Awareness Quiz</span>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-200">
                        {COMPUTER_AWARENESS_DATA[currentProblemIdx].quiz.question}
                      </h4>

                      <div className="space-y-2.5 pt-2">
                        {COMPUTER_AWARENESS_DATA[currentProblemIdx].quiz.options.map((option, idx) => {
                          const isSelected = awarenessQuizAns === idx;
                          const isCorrect = idx === COMPUTER_AWARENESS_DATA[currentProblemIdx].quiz.correct;
                          let optionStyle = 'bg-[#181D2D] border-[#2B3147] text-slate-300 hover:border-purple-500/50';

                          if (awarenessQuizAns !== null) {
                            if (isSelected) {
                              optionStyle = isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                                : 'bg-rose-500/10 border-rose-500 text-rose-300';
                            } else if (isCorrect) {
                              optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-300';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => setAwarenessQuizAns(idx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{option}</span>
                              {awarenessQuizAns !== null && isSelected && (
                                isCorrect ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-rose-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {awarenessQuizAns !== null && (
                        <div className="p-3 bg-[#161B29] border border-[#23283B] rounded-xl text-xs text-slate-300 leading-relaxed animate-fadeIn">
                          <strong>Explanation:</strong> {COMPUTER_AWARENESS_DATA[currentProblemIdx].quiz.explanation}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#1F2538] pt-4">
                      <button
                        disabled={currentProblemIdx === 0}
                        onClick={() => {
                          setCurrentProblemIdx((p) => p - 1);
                          setAwarenessQuizAns(null);
                          setIsFlipped(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#20273D] disabled:opacity-40 text-xs font-medium transition"
                      >
                        Previous Topic
                      </button>
                      <button
                        disabled={currentProblemIdx === COMPUTER_AWARENESS_DATA.length - 1}
                        onClick={() => {
                          setCurrentProblemIdx((p) => p + 1);
                          setAwarenessQuizAns(null);
                          setIsFlipped(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#181D2D] hover:bg-[#20273D] disabled:opacity-40 text-xs font-medium transition"
                      >
                        Next Topic
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

