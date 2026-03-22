import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Lock, Unlock, AlertTriangle, HelpCircle, ChevronRight, Power, Cpu } from 'lucide-react';

const LEVELS = [
  {
    id: 1,
    title: "ROOM 0x01: THE RECURSION PROTOCOL",
    description: "The terminal boots up. A script is calculating the total number of active nodes in a botnet.",
    puzzle: "A master node infects 3 new nodes on Day 1. Each newly infected node infects exactly 3 new nodes the next day, and then goes dormant (cannot infect anymore, but remains active). Including the master node, how many TOTAL active nodes are there by the end of Day 6?",
    answer: "1093",
    hints: [
      "This is a geometric progression sum.",
      "The number of new nodes each day is 3^n. (Day 1: 3, Day 2: 9, Day 3: 27...)",
      "Calculate the sum: 1 + 3 + 9 + 27 + 81 + 243 + 729."
    ]
  },
  {
    id: 2,
    title: "ROOM 0x02: THE BITWISE VAULT",
    description: "A heavy blast door is sealed by a low-level hardware lock. You need to send the correct decimal signal.",
    puzzle: "Register A holds the 8-bit binary value 10110100. Apply a bitwise XOR with 11110000. Take the result and apply a bitwise LEFT SHIFT by 1 (pad with 0). Convert the final 8-bit binary result to a decimal number.",
    answer: "136",
    hints: [
      "XOR outputs 1 only if the bits are different. 10110100 XOR 11110000 = 01000100.",
      "Shift 01000100 left by 1 position. The leftmost bit drops off, and a 0 is added to the right.",
      "The shifted binary is 10001000. Convert this base-2 number to base-10."
    ]
  },
  {
    id: 3,
    title: "ROOM 0x03: THE VISUAL MATRIX",
    description: "A large monitor displays a flickering grid of blocks. A sticky note says: 'Rows are 5-bit binary. Sum them up.'",
    asciiArt: `
[█] [█] [ ] [█] [ ]
[ ] [█] [█] [ ] [█]
[█] [ ] [ ] [█] [█]
[ ] [ ] [█] [█] [ ]
[█] [█] [█] [ ] [ ]
    `,
    puzzle: "Calculate the total decimal sum of the 5 rows.",
    answer: "92",
    hints: [
      "[█] represents 1, [ ] represents 0.",
      "Row 1 is 11010 in binary. Convert it to decimal (16 + 8 + 2 = 26).",
      "Row 2 is 01101 (13). Row 3 is 10011 (19). Row 4 is 00110 (6). Row 5 is 11100 (28)."
    ]
  },
  {
    id: 4,
    title: "ROOM 0x04: THE ROUTING DAEMON",
    description: "The network is fragmented. You must find the optimal routing path to bypass the firewall.",
    puzzle: "Find the shortest path weight from Node A to Node F. Edges and weights: A-B:4, A-C:2, B-C:5, B-D:10, C-E:3, E-D:4, D-F:11, E-F:8.",
    answer: "13",
    hints: [
      "Map out the nodes and use Dijkstra's algorithm or trace the paths manually.",
      "The shortest path to E is A -> C -> E (Weight 2 + 3 = 5).",
      "From E, you can go directly to F (Weight 8). 5 + 8 = ?"
    ]
  },
  {
    id: 5,
    title: "ROOM 0x05: THE RSA INTERCEPT",
    description: "You intercepted an encrypted transmission containing the override code.",
    puzzle: "The system uses a weak RSA encryption. Public key (e, n) = (5, 14). The intercepted ciphertext 'c' is 2. Find the original plaintext message 'm', knowing the formula is: m^e ≡ c (mod n).",
    answer: "4",
    hints: [
      "You need to find 'm' such that (m^5) modulo 14 equals 2.",
      "Since 'n' is only 14, you can brute-force 'm' by testing numbers from 1 to 13.",
      "Try m=4. What is 4^5 (which is 1024) modulo 14?"
    ]
  },
  {
    id: 6,
    title: "ROOM 0x06: THE ASCII LABYRINTH",
    description: "The terminal displays a top-down map of the ventilation shafts. You need to find the shortest path to the exit.",
    asciiArt: `
[S] [ ] [ ] [█] [E]
[█] [█] [ ] [█] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [█] [█] [█] [█]
[ ] [ ] [ ] [ ] [ ]
    `,
    puzzle: "[S] is Start, [E] is Exit, [█] are walls, [ ] are open paths. You can only move up, down, left, right. What is the minimum number of steps to reach [E]?",
    answer: "8",
    hints: [
      "Trace the path carefully. You cannot move diagonally.",
      "From [S], go Right twice, then Down twice to bypass the first wall.",
      "Then go Right twice, and Up twice to reach [E]. Count the total steps."
    ]
  },
  {
    id: 7,
    title: "ROOM 0x07: THE LOGIC BOMB",
    description: "A logic bomb is ticking. It requires a 4-digit defusal code based on strict constraints.",
    puzzle: "Find the LARGEST 4-digit code (D1, D2, D3, D4) where: The sum of all digits is 14. D2 is exactly twice D4. D3 is the sum of D1 and D4. D1 is a prime number.",
    answer: "5261",
    hints: [
      "Write out the equations: D1+D2+D3+D4=14, D2=2*D4, D3=D1+D4. Substitute them to get D1 + 2*D4 = 7.",
      "Test possible values for D4. If D4=1, D1=5 (prime). If D4=2, D1=3 (prime).",
      "Calculate the full codes for both possibilities (5261 and 3452) and choose the largest one."
    ]
  },
  {
    id: 8,
    title: "ROOM 0x08: THE AUTOMATON'S MAZE",
    description: "The final core is guarded by a security automaton. You must predict its final coordinates to bypass its patrol.",
    puzzle: "The automaton starts at Cartesian coordinates (0,0) facing NORTH. It executes this command string: 'FFRFFLFRFF' (F=Forward 1 unit, R=Turn Right 90°, L=Turn Left 90°). What is the Manhattan distance from its starting point to its final point?",
    answer: "7",
    hints: [
      "Track the coordinates. Start: (0,0) North. 'FF' -> (0,2) North.",
      "'R' -> faces East. 'FF' -> (2,2) East. 'L' -> faces North. 'F' -> (2,3) North.",
      "'R' -> faces East. 'FF' -> (4,3) East. Manhattan distance is |x| + |y|."
    ]
  },
  {
    id: 9,
    title: "ROOM 0x09: THE SIGNAL NOISE",
    description: "The screen is filled with static, but your cybernetic eye module detects a pattern in the negative space.",
    asciiArt: `
███   ██████      ██
███   ███████████   
██     █████████   █
█████   ███████   ██
█████   ██████   ███
    `,
    puzzle: "Extract the 2-digit number hidden in the static.",
    answer: "47",
    hints: [
      "Don't look at the solid blocks (█). Look at the empty spaces.",
      "Try squinting your eyes or stepping back from the screen.",
      "The empty spaces form two numbers. The first is 4."
    ]
  },
  {
    id: 10,
    title: "ROOM 0x0A: THE SYBIL ATTACK",
    description: "Four rogue AI agents are blaming each other for a system breach. Only ONE agent is telling the truth. The others are lying.",
    puzzle: "ALPHA says: 'BETA caused the breach.'\nBETA says: 'DELTA caused the breach.'\nGAMMA says: 'I did not cause the breach.'\nDELTA says: 'BETA is lying.'\nWho caused the breach? (Enter ALPHA, BETA, GAMMA, or DELTA)",
    answer: "GAMMA",
    hints: [
      "Notice that BETA and DELTA's statements contradict each other. One of them MUST be the single truth-teller.",
      "Since only ONE agent is telling the truth (either BETA or DELTA), ALPHA and GAMMA must be lying.",
      "If GAMMA is lying about NOT causing the breach... what does that mean?"
    ]
  },
  {
    id: 11,
    title: "ROOM 0x0B: THE TEMPORAL SHIFT",
    description: "A chronos-daemon has scrambled the system clock. You must answer its riddle to resync the timeline.",
    puzzle: "The daemon asks: 'If yesterday was tomorrow, today would be Friday. What day is today?'",
    answer: "SUNDAY",
    hints: [
      "Let the actual today be X. Let the hypothetical today be Y.",
      "The hypothetical today (Y) is Friday. The riddle says: 'If yesterday (X-1) was tomorrow (Y+1)'.",
      "Substitute Y with Friday: X - 1 = Saturday. Solve for X."
    ]
  },
  {
    id: 12,
    title: "ROOM 0x0C: THE HEAVY PAYLOAD",
    description: "A data stream contains 1000 packets. Exactly one packet is a malicious payload that is slightly heavier than the rest.",
    puzzle: "You have a digital balance scale that can compare the weight of any two sets of packets. What is the MINIMUM number of weighings required to GUARANTEE finding the malicious packet?",
    answer: "7",
    hints: [
      "Don't divide the packets into 2 groups (halves). Divide them into 3 groups.",
      "If you weigh Group A vs Group B, and they are equal, the heavy packet is in Group C.",
      "Each weighing reduces the number of suspect packets by a factor of 3. 3^n >= 1000. Find n."
    ]
  }
];

const HINT_COSTS = [5, 10, 15];

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [memory, setMemory] = useState(100);
  const [isEscaped, setIsEscaped] = useState(false);
  const [logs, setLogs] = useState<string[]>(['SYSTEM BOOT...', 'INITIALIZING ESCAPE PROTOCOL...', 'AWAITING USER INPUT.']);
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const level = LEVELS[currentLevel];

  useEffect(() => {
    if (inputRef.current && !isEscaped) {
      inputRef.current.focus();
    }
  }, [currentLevel, isEscaped, revealedHints]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRequestHint = () => {
    if (revealedHints >= 3) return;
    
    const cost = HINT_COSTS[revealedHints];
    if (memory >= cost) {
      setMemory(prev => prev - cost);
      setRevealedHints(prev => prev + 1);
      setLogs(prev => [...prev, `> REQUESTING HINT LEVEL ${revealedHints + 1}...`, `MEMORY ALLOCATED: -${cost} UNITS.`]);
    } else {
      setLogs(prev => [...prev, '> REQUESTING HINT...', 'ERROR: INSUFFICIENT SYSTEM MEMORY.']);
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const normalizedInput = inputValue.trim().toUpperCase();
    const normalizedAnswer = level.answer.toUpperCase();

    if (normalizedInput === normalizedAnswer) {
      setLogs(prev => [...prev, `> ${inputValue}`, 'ACCESS GRANTED. PROCEEDING TO NEXT SECTOR...']);
      setError(false);
      setSuccess(true);
      setInputValue('');
      setRevealedHints(0);
      
      if (currentLevel === LEVELS.length - 1) {
        setTimeout(() => { setIsEscaped(true); setSuccess(false); }, 1500);
      } else {
        setTimeout(() => { setCurrentLevel(prev => prev + 1); setSuccess(false); }, 1500);
      }
    } else {
      setLogs(prev => [...prev, `> ${inputValue}`, 'ACCESS DENIED. INCORRECT PASSCODE.']);
      setError(true);
      setSuccess(false);
      setInputValue('');
      setTimeout(() => setError(false), 500);
    }
  };

  if (isEscaped) {
    return (
      <div className="min-h-screen bg-zinc-950 text-emerald-500 font-mono p-8 flex flex-col items-center justify-center crt relative">
        <div className="scanline"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center z-10"
        >
          <Unlock className="w-24 h-24 mx-auto mb-8 text-emerald-400" />
          <h1 className="text-5xl font-bold mb-4 glitch">SYSTEM OVERRIDE SUCCESSFUL</h1>
          <p className="text-xl text-emerald-600 mb-8">You have successfully escaped the algorithmic facility.</p>
          <div className="text-emerald-400 mb-8">REMAINING MEMORY: {memory} UNITS</div>
          <button 
            onClick={() => {
              setCurrentLevel(0);
              setIsEscaped(false);
              setMemory(100);
              setRevealedHints(0);
              setLogs(['SYSTEM REBOOT...', 'INITIALIZING ESCAPE PROTOCOL...']);
            }}
            className="px-6 py-3 border border-emerald-500 hover:bg-emerald-900/30 transition-colors flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Power className="w-5 h-5" />
            RESTART SIMULATION
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-zinc-950 text-emerald-500 font-mono flex flex-col crt relative overflow-hidden">
      <div className="scanline"></div>
      
      {/* Header */}
      <header className="border-b border-emerald-900/50 p-4 flex justify-between items-center bg-zinc-950/80 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          <span className="font-bold tracking-widest hidden sm:inline">ALGO_ESCAPE_OS v1.1</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span>MEM: {memory}</span>
          </div>
          <span>SECTOR: {currentLevel + 1}/{LEVELS.length}</span>
          <span className="animate-pulse text-red-500">LOCKED</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden z-10 min-h-0">
        {/* Left Panel: Puzzle Info */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto border-b md:border-b-0 md:border-r border-emerald-900/50 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLevel}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-emerald-600" />
                {level.title}
              </h2>
              
              <div className="space-y-6 text-emerald-400/90 leading-relaxed">
                <p className="text-lg">{level.description}</p>
                
                {/* @ts-ignore - asciiArt is optional but exists on some levels */}
                {level.asciiArt && (
                  <div className="bg-black/60 border border-emerald-900/50 p-4 rounded-sm overflow-x-auto shadow-inner">
                    {/* @ts-ignore */}
                    <pre className="font-mono text-emerald-500 text-sm leading-tight tracking-widest">
                      {/* @ts-ignore */}
                      {level.asciiArt.trim()}
                    </pre>
                  </div>
                )}
                
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-6 rounded-sm">
                  <h3 className="text-emerald-500 font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    PUZZLE DIRECTIVE:
                  </h3>
                  <p className="text-emerald-300 whitespace-pre-wrap">{level.puzzle}</p>
                </div>

                {revealedHints > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-zinc-900 border border-emerald-800/50 p-4 rounded-sm overflow-hidden space-y-3"
                  >
                    <h3 className="text-emerald-600 font-bold mb-1 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      SYSTEM HINTS DECRYPTED:
                    </h3>
                    {level.hints.slice(0, revealedHints).map((hint, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-500/80 text-sm flex gap-2"
                      >
                        <span className="text-emerald-700">[{idx + 1}]</span> {hint}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel: Terminal Input */}
        <div className="w-full md:w-1/3 md:min-w-[320px] flex-1 md:flex-none bg-zinc-950 flex flex-col min-h-0">
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2">
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div
                  key={`${i}-${log}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${log.startsWith('>') ? 'text-emerald-300' : 'text-emerald-600'} ${log.includes('DENIED') || log.includes('ERROR') ? 'text-red-500' : ''} ${log.includes('GRANTED') ? 'text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : ''}`}
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={logsEndRef} />
          </div>
          
          <div className="p-4 border-t border-emerald-900/50 bg-zinc-950">
            <form onSubmit={handleSubmit} className="relative">
              <motion.div 
                className="flex items-center"
                animate={
                  error ? { x: [-5, 5, -5, 5, 0] } :
                  success ? { scale: [1, 1.02, 1] } :
                  {}
                }
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5 text-emerald-500 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`w-full bg-transparent border-b-2 ${error ? 'border-red-500 text-red-500' : success ? 'border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-emerald-500 text-emerald-400'} focus:outline-none focus:border-emerald-300 py-2 transition-colors`}
                  placeholder="ENTER PASSCODE..."
                  autoComplete="off"
                  spellCheck="false"
                  disabled={success}
                />
              </motion.div>
            </form>
            
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              {revealedHints < 3 ? (
                <motion.button
                  onClick={handleRequestHint}
                  whileHover={{ scale: 1.02, textShadow: "0px 0px 8px rgba(16,185,129,0.8)" }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs cursor-pointer text-emerald-500 hover:text-emerald-300 transition-colors flex items-center gap-1 relative overflow-hidden group px-2 py-1 -ml-2 rounded-sm"
                >
                  <span className="relative z-10">[ DECRYPT HINT TIER {revealedHints + 1} (-{HINT_COSTS[revealedHints]} MEM) ]</span>
                  <span className="absolute inset-0 bg-emerald-500/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
                </motion.button>
              ) : (
                <span className="text-xs text-emerald-800 px-2 py-1 -ml-2">[ ALL HINTS DECRYPTED ]</span>
              )}
              <span className="text-xs text-emerald-700">PRESS ENTER TO SUBMIT</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
