import React, { useState, useMemo, useEffect, useRef } from 'react';

const QUOTES = [
  { text: 'Focus on being productive, not busy.', author: 'Tim Ferriss' },
  { text: "The secret of getting ahead is getting started.", author: 'Mark Twain' },
  { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
  { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
  { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
  { text: 'Your focus determines your reality.', author: 'George Lucas' },
  { text: 'Amateurs sit and wait for inspiration, the rest of us just get up and go to work.', author: 'Stephen King' },
];

const ENCOURAGEMENTS = ["You're doing better than you think.", 'Consistency beats intensity.', 'Small steps lead to big results.', 'One task at a time.', 'Your future self will thank you.'];

const TIPS = [
  { title: 'Stay Sharp', text: 'Protect your deep-work blocks like meetings you cannot miss.', icon: 'fa-bullseye' },
  { title: 'Keep Going', text: 'Discipline closes the gap motivation leaves behind.', icon: 'fa-shield-heart' },
  { title: 'Begin Now', text: 'The hardest part of any task is the first five minutes.', icon: 'fa-play' },
  { title: 'Level Up', text: 'A 1% improvement daily compounds into mastery within a year.', icon: 'fa-chart-line' },
];

const PENALTIES = [
  'No coffee tomorrow morning ☕',
  'No social media scrolling tonight 📱',
  'Pay a friend $5 💸',
  'Walk 10,000 steps before sleeping 🚶',
  'Do 50 pushups/squats tonight 🏋️',
  'No TV / Gaming tonight 🎮',
];



export function Motivation({ tasks }) {
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * QUOTES.length));
  const currentQuote = QUOTES[quoteIndex];

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [contract, setContract] = useState(null);
  const [terms, setTerms] = useState('');
  const [penalty, setPenalty] = useState(PENALTIES[0]);
  const [customName, setCustomName] = useState('');



  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter((t) => t.date === today);
    const totalPomos = todaysTasks.reduce((acc, t) => acc + t.completedPomodoros, 0);
    return { totalPomos };
  }, [tasks]);

  const focusMessage = useMemo(() => {
    if (stats.totalPomos === 0) return { text: 'Start with just 25 minutes.', icon: 'fa-seedling' };
    if (stats.totalPomos <= 4) return { text: "Great job! You're building consistency.", icon: 'fa-fire' };
    return { text: "Amazing focus today. Don't forget to rest.", icon: 'fa-award' };
  }, [stats.totalPomos]);

  const refreshQuote = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === quoteIndex && QUOTES.length > 1);
    setQuoteIndex(nextIndex);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`focus_contract_${today}`);
    if (saved) {
      setContract(JSON.parse(saved));
    }
  }, []);

  const saveContract = (newContract) => {
    const today = new Date().toISOString().split('T')[0];
    setContract(newContract);
    if (newContract) {
      localStorage.setItem(`focus_contract_${today}`, JSON.stringify(newContract));
    } else {
      localStorage.removeItem(`focus_contract_${today}`);
    }
  };

  // Canvas Drawing Logic
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Support mouse or touch event
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#2c2420'; // ink color
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSealContract = () => {
    if (!terms.trim() || !customName.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL();
    
    const newContract = {
      signed: true,
      name: customName,
      terms: terms,
      penalty: penalty,
      signature: signatureData,
      date: new Date().toISOString().split('T')[0],
      status: 'active' // active, completed, failed
    };
    saveContract(newContract);
  };

  const microEncouragement = ENCOURAGEMENTS[quoteIndex % ENCOURAGEMENTS.length];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slide-up pb-16 w-full">
      <style>{`
        .wax-seal {
          transform: rotate(-15deg);
          border: 3px double var(--accent);
          color: var(--accent);
          font-family: 'Caveat', cursive;
          box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.05);
        }
        .canvas-ruled {
          background-image: linear-gradient(to bottom, transparent, transparent 29px, rgba(44,36,32,0.06) 29px, rgba(44,36,32,0.06) 30px);
          background-size: 100% 30px;
        }
        .dark .canvas-ruled {
          background-image: linear-gradient(to bottom, transparent, transparent 29px, rgba(232,224,212,0.05) 29px, rgba(232,224,212,0.05) 30px);
          background-size: 100% 30px;
        }

      `}</style>

      {/* Header */}
      <div className="text-center space-y-2">
        <i className={`fas ${focusMessage.icon} text-3xl text-accent`}></i>
        <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk tracking-tight">{focusMessage.text}</h2>
        <p className="text-sm font-body text-ink-light dark:text-chalk-dim uppercase tracking-wider">
          Focus Level: {stats.totalPomos > 4 ? 'Elite' : stats.totalPomos > 0 ? 'Steady' : 'Ready'}
        </p>
        <div className="sketch-divider mx-auto w-48 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Card */}
          <div className="sketch-card ink-shadow-lg p-8 md:p-12 text-center relative">
            <div className="space-y-6">
              <div className="space-y-4">
                <i className="fas fa-quote-left text-2xl text-ink-faint dark:text-chalk-dim opacity-20"></i>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-ink dark:text-chalk leading-tight italic">
                  &ldquo;{currentQuote.text}&rdquo;
                </h3>
                <p className="font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider text-sm">
                  — {currentQuote.author || 'Unknown'}
                </p>
              </div>

              <p className="text-accent text-sm font-heading font-bold italic uppercase tracking-wider opacity-70">{microEncouragement}</p>

              <button
                onClick={refreshQuote}
                className="sketch-btn-outline px-6 py-2 text-base"
              >
                <i className="fas fa-arrows-rotate mr-2 text-sm"></i>
                Next Wisdom
              </button>
            </div>
          </div>

          {/* Daily Focus Contract */}
          <div className="sketch-card p-6 space-y-6">
            <div className="border-b border-border-light dark:border-border-light/20 pb-4">
              <h4 className="text-2xl font-heading font-bold text-ink dark:text-chalk">Daily Focus Contract</h4>
              <p className="text-xs font-body text-ink-light dark:text-chalk-dim">Sealing a formal commitment with yourself triggers discipline and bars self-negotiation.</p>
            </div>

            {!contract ? (
              /* Contract Builder (Unsigned) */
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider pl-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full sketch-input text-base"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider pl-1">
                        Failure Penalty
                      </label>
                      <select
                        value={penalty}
                        onChange={(e) => setPenalty(e.target.value)}
                        className="w-full sketch-input text-sm bg-transparent outline-none cursor-pointer py-2.5"
                      >
                        {PENALTIES.map(p => (
                          <option key={p} value={p} className="bg-paper dark:bg-paper-dark text-ink dark:text-chalk">
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider pl-1">
                      Your Promise Today
                    </label>
                    <textarea
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="e.g. Complete 4 Pomodoros on project coding and review tasks..."
                      className="w-full h-20 sketch-input text-base font-body resize-none"
                    />
                  </div>
                </div>

                {/* Signature Board */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider">
                      Draw Your Signature
                    </label>
                    <button
                      onClick={clearCanvas}
                      className="text-[10px] font-heading font-bold text-accent hover:text-accent-muted uppercase tracking-wider transition-colors"
                    >
                      Clear Board
                    </button>
                  </div>

                  <div className="border border-border-color rounded-sketch overflow-hidden bg-paper dark:bg-paper-dark">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={100}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-24 canvas-ruled cursor-crosshair block"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSealContract}
                  disabled={!terms.trim() || !customName.trim()}
                  className="sketch-btn w-full py-3 text-base flex items-center justify-center gap-2"
                >
                  <i className="fas fa-file-signature text-sm"></i>
                  <span>Sign & Seal Daily Contract</span>
                </button>
              </div>
            ) : (
              /* Signed Contract Paper */
              <div className="notebook-page p-6 pl-8 space-y-6 relative overflow-hidden">
                {/* Stamp */}
                <div className="absolute top-4 right-4 wax-seal font-bold text-sm tracking-widest px-4 py-2 border rounded-sketch uppercase select-none text-ink border-ink dark:text-chalk dark:border-chalk bg-ink/5">
                  Sealed 🔏
                </div>

                <div className="space-y-4 pr-16 pl-4">
                  <div className="space-y-2">
                    <h5 className="font-heading font-bold text-xl uppercase tracking-wider text-ink dark:text-chalk">
                      Solemn Covenant
                    </h5>
                    <p className="text-xs font-body text-ink-light dark:text-chalk-dim italic border-b border-border-light dark:border-border-light/10 pb-2">
                      Dated: {contract.date}
                    </p>
                  </div>

                  <div className="font-heading font-bold text-lg text-ink dark:text-chalk leading-relaxed whitespace-pre-wrap">
                    &ldquo;I, {contract.name}, solemnly swear to {contract.terms} today. No excuses.&rdquo;
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-heading font-bold text-accent uppercase tracking-wider">
                      Penalty on breach:
                    </span>
                    <span className="font-heading font-bold text-sm text-ink dark:text-chalk">
                      {contract.penalty}
                    </span>
                  </div>
                </div>

                {/* Drawn Signature display */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-6 pl-4 pr-6 border-t border-border-light dark:border-border-light/10 mt-4">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider">
                      Covenant Signature
                    </span>
                    <div className="border border-border-light dark:border-border-light/10 rounded-sketch bg-paper dark:bg-paper-dark p-1 max-w-fit">
                      <img
                        src={contract.signature}
                        alt="Contract signature"
                        className="h-10 max-w-[200px] object-contain select-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => saveContract(null)}
                    className="sketch-btn-outline px-4 py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <i className="fas fa-trash text-[10px]"></i>
                    <span>Break Seal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily Pulse */}
        <div className="space-y-6">
          <div className="bg-ink dark:bg-chalk rounded-sketch p-6 text-paper dark:text-paper-dark ink-shadow">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider opacity-50 mb-4">Daily Pulse</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-body opacity-80">Focus Score</span>
                <span className="text-xl font-heading font-bold">{Math.min(stats.totalPomos * 10, 100)}%</span>
              </div>
              <div className="w-full h-2 bg-paper/20 dark:bg-paper-dark/20 rounded-sketch overflow-hidden">
                <div
                  className="h-full bg-paper dark:bg-paper-dark transition-all duration-1000"
                  style={{ width: `${Math.min(stats.totalPomos * 10, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-body opacity-50 uppercase tracking-wider leading-relaxed">
                Consistency is the bridge between goals and accomplishment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Fuel Tips */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-heading font-bold text-ink dark:text-chalk">Daily Fuel</h3>
          <p className="text-sm font-body text-ink-light dark:text-chalk-dim">Short bursts of inspiration.</p>
          <div className="sketch-divider mt-2 w-32"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIPS.map((tip) => (
            <div key={tip.title} className="sketch-card p-5 space-y-3 transition-all hover:ink-shadow">
              <i className={`fas ${tip.icon} text-lg text-accent opacity-60`}></i>
              <h4 className="text-lg font-heading font-bold text-ink dark:text-chalk">{tip.title}</h4>
              <p className="text-xs font-body text-ink-light dark:text-chalk-dim leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-6 border-t border-ink-faint dark:border-ink-light/20">
        <p className="text-ink-faint dark:text-chalk-dim text-xs font-heading font-bold uppercase tracking-wider">progress over perfection · day by day</p>
      </div>
    </div>
  );
}
