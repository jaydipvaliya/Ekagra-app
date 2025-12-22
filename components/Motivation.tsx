import React, { useState, useMemo } from 'react';
import { Task, Habit, TaskStatus } from '../types';

interface MotivationProps {
  intention: string;
  onIntentionChange: (val: string) => void;
  tasks: Task[];
  habits: Habit[];
}

const QUOTES = [
  { text: "Focus on being productive, not busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Deep work is the superpower of the 21st century.", author: "Cal Newport" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your focus determines your reality.", author: "George Lucas" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" }
];

const ENCOURAGEMENTS = [
  "You're doing better than you think.",
  "Consistency beats intensity.",
  "Small steps lead to big results.",
  "One task at a time.",
  "Your future self will thank you."
];

// Curated list of high-quality motivational videos with unique banners
const REELS = [
  { id: "1", title: "The Power of Focus", embedId: "m1K7vjGj8vA", category: "Focus", banner: "STAY SHARP", color: "bg-indigo-600" },
  { id: "2", title: "Discipline vs Motivation", embedId: "K6Z8S8_h438", category: "Discipline", banner: "KEEP GOING", color: "bg-rose-600" },
  { id: "3", title: "Start Small, Think Big", embedId: "76973_W3l1c", category: "Productivity", banner: "BEGIN NOW", color: "bg-emerald-600" },
  { id: "4", title: "The 1% Rule", embedId: "TzZ3mJ6K8zE", category: "Growth", banner: "LEVEL UP", color: "bg-amber-600" },
  { id: "5", title: "Overcoming Laziness", embedId: "N7_YVqK7D-0", category: "Mindset", banner: "WAKE UP", color: "bg-sky-600" },
  { id: "6", title: "Protect Your Energy", embedId: "w_C_S5D-e3o", category: "Wellness", banner: "REST WELL", color: "bg-violet-600" },
  { id: "7", title: "Why We Do It", embedId: "O9-x2_pXhM0", category: "Purpose", banner: "REMEMBER WHY", color: "bg-orange-600" },
  { id: "8", title: "The Flow State", embedId: "fVIe6G-E1f8", category: "Deep Work", banner: "LOCK IN", color: "bg-slate-900" },
];

export const Motivation: React.FC<MotivationProps> = ({ intention, onIntentionChange, tasks, habits }) => {
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * QUOTES.length));
  
  const currentQuote = QUOTES[quoteIndex];

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.date === today);
    const totalPomos = todaysTasks.reduce((acc, t) => acc + t.completedPomodoros, 0);
    return { totalPomos };
  }, [tasks]);

  const focusMessage = useMemo(() => {
    if (stats.totalPomos === 0) {
      return {
        text: "Start with just 25 minutes. That's enough.",
        icon: "fa-seedling",
        color: "text-slate-400"
      };
    } else if (stats.totalPomos <= 4) {
      return {
        text: "Great job! You're building consistency.",
        icon: "fa-fire",
        color: "text-indigo-500"
      };
    } else {
      return {
        text: "Amazing focus today. Don't forget to rest.",
        icon: "fa-award",
        color: "text-emerald-500"
      };
    }
  }, [stats.totalPomos]);

  const refreshQuote = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === quoteIndex && QUOTES.length > 1);
    setQuoteIndex(nextIndex);
  };

  const microEncouragement = useMemo(() => {
    return ENCOURAGEMENTS[quoteIndex % ENCOURAGEMENTS.length];
  }, [quoteIndex]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      <style>{`
        @keyframes banner-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes banner-entrance {
          from { opacity: 0; transform: translateY(-10px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .banner-animate {
          opacity: 0;
          animation: banner-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards, banner-float 3s ease-in-out infinite 0.8s;
        }
        .glass-shine::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-25deg);
          animation: shine 4s infinite;
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>

      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className={`text-4xl ${focusMessage.color} transition-colors duration-500`}>
          <i className={`fas ${focusMessage.icon}`}></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {focusMessage.text}
        </h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
          Current Focus Level: {stats.totalPomos > 4 ? 'Elite' : stats.totalPomos > 0 ? 'Steady' : 'Ready'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Quote & Intention */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Quote Card */}
          <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-4xl font-black text-slate-700 leading-tight italic">
                  &ldquo;{currentQuote.text}&rdquo;
                </h3>
                <p className="text-slate-400 font-black uppercase tracking-[0.25em] text-[10px]">
                  — {currentQuote.author || "Unknown"}
                </p>
              </div>

              <div className="pt-2">
                <p className="text-indigo-400 text-sm font-bold italic opacity-80 uppercase tracking-widest">
                  {microEncouragement}
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={refreshQuote}
                  className="bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-500 px-8 py-4 rounded-2xl font-black transition-all border border-slate-100 active:scale-95 shadow-sm"
                >
                  <i className="fas fa-arrows-rotate mr-2"></i>
                  Next Wisdom
                </button>
              </div>
            </div>
          </div>

          {/* Intention Section */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 text-center space-y-6 shadow-sm">
            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Today's North Star</h4>
              <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
                Define the absolute priority for your day.
              </p>
            </div>

            <textarea 
              value={intention}
              onChange={(e) => onIntentionChange(e.target.value)}
              placeholder="My one thing is..."
              className="w-full h-24 bg-slate-50 border-none rounded-2xl p-6 text-center text-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-200 resize-none"
            />
          </div>
        </div>

        {/* Right Side: Quick Stats / Daily Pulse */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Daily Pulse</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold opacity-80">Focus Score</span>
                <span className="text-xl font-black">{stats.totalPomos * 10}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000" 
                  style={{ width: `${Math.min(stats.totalPomos * 10, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-relaxed">
                Consistency is the bridge between goals and accomplishment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Reels Section */}
      <div className="space-y-8">
        <div className="flex items-end justify-between px-4">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Daily Fuel</h3>
            <p className="text-slate-400 text-sm font-medium">Short bursts of inspiration to keep you moving.</p>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">New Content</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REELS.map((reel, index) => (
            <div 
              key={reel.id} 
              className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[9/16] relative bg-slate-100">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${reel.embedId}?modestbranding=1&rel=0`}
                  title={reel.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Enhanced Motivational Banner Overlay with Staggered Entrance Animation */}
                <div className="absolute top-4 left-4 right-4 flex justify-start pointer-events-none">
                  <div 
                    className={`relative overflow-hidden ${reel.color} px-5 py-2 rounded-2xl shadow-2xl border border-white/20 banner-animate glass-shine`}
                    style={{ 
                      animationDelay: `${index * 0.15}s, ${index * 0.15 + 0.8}s`,
                    }}
                  >
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.25em] whitespace-nowrap drop-shadow-sm">
                      {reel.banner}
                    </span>
                  </div>
                </div>

                {/* Focus Badge Overlay */}
                <div className={`absolute bottom-4 left-4 p-2.5 rounded-xl ${reel.color} text-white shadow-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500 border border-white/20`}>
                  <i className="fas fa-bolt text-xs"></i>
                </div>
              </div>
              
              <div className="p-5 flex items-center justify-between bg-white border-t border-slate-50">
                <div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">
                    {reel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {reel.title}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all shadow-inner">
                  <i className="fas fa-play text-xs"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Encouragement */}
      <div className="text-center pt-8 border-t border-slate-100">
        <p className="text-slate-300 text-xs font-black uppercase tracking-[0.3em]">
          Progress over perfection • Day by day
        </p>
      </div>
    </div>
  );
};