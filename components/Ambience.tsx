
import React, { useState, useEffect, useRef } from 'react';
import { AmbienceSoundState } from '../types';

interface AmbienceProps {
  initialState: AmbienceSoundState[];
  onStateChange: (state: AmbienceSoundState[]) => void;
}

interface SoundInfo {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
  bgColor: string;
}

const SOUNDS: SoundInfo[] = [
  { id: 'rain', name: 'Rain', icon: 'fa-cloud-showers-heavy', url: 'https://www.soundjay.com/nature/rain-07.mp3', color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { id: 'fireplace', name: 'Fireplace', icon: 'fa-fire', url: 'https://www.soundjay.com/nature/fire-1.mp3', color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { id: 'cafe', name: 'Café', icon: 'fa-coffee', url: 'https://www.soundjay.com/misc/coffee-shop-1.mp3', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { id: 'ocean', name: 'Ocean', icon: 'fa-water', url: 'https://www.soundjay.com/nature/ocean-waves-1.mp3', color: 'text-teal-500', bgColor: 'bg-teal-50' },
  { id: 'whitenoise', name: 'White Noise', icon: 'fa-wind', url: 'https://www.soundjay.com/mechanical/fan-1.mp3', color: 'text-slate-500', bgColor: 'bg-slate-100' },
];

export const Ambience: React.FC<AmbienceProps> = ({ initialState, onStateChange }) => {
  const [activeSounds, setActiveSounds] = useState<Record<string, AmbienceSoundState>>(() => {
    const initial: Record<string, AmbienceSoundState> = {};
    initialState.forEach(s => {
      initial[s.id] = s;
    });
    return initial;
  });

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Initialize and sync audio objects
  useEffect(() => {
    SOUNDS.forEach(sound => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audioRefs.current[sound.id] = audio;
      }
      
      const audio = audioRefs.current[sound.id];
      const state = activeSounds[sound.id];
      
      if (state?.isPlaying) {
        audio.volume = (state.volume || 50) / 100;
        audio.play().catch(e => console.warn("Auto-play blocked", e));
      } else {
        audio.pause();
      }
    });

    // Notify parent of state changes for persistence
    onStateChange(Object.values(activeSounds));
  }, [activeSounds, onStateChange]);

  // Clean up on unmount (or technically keep them if desired, but here we pause them if the user prefers)
  // Actually, usually ambience should stay playing during Pomodoro. 
  // We'll keep them playing but ensure we don't leak refs.

  const toggleSound = (id: string) => {
    setActiveSounds(prev => {
      const current = prev[id] || { id, isPlaying: false, volume: 50 };
      return {
        ...prev,
        [id]: { ...current, isPlaying: !current.isPlaying }
      };
    });
  };

  const updateVolume = (id: string, volume: number) => {
    setActiveSounds(prev => {
      const current = prev[id] || { id, isPlaying: false, volume: 50 };
      return {
        ...prev,
        [id]: { ...current, volume }
      };
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Ambience</h2>
        <p className="text-slate-500 font-medium">Create your perfect focus environment with immersive soundscapes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOUNDS.map((sound) => {
          const state = activeSounds[sound.id] || { id: sound.id, isPlaying: false, volume: 50 };
          
          return (
            <div 
              key={sound.id}
              className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 relative overflow-hidden group ${
                state.isPlaying 
                  ? 'border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' 
                  : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'
              }`}
            >
              {/* Animated Background Pulse when playing */}
              {state.isPlaying && (
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${sound.bgColor} rounded-full blur-3xl opacity-50 animate-pulse`}></div>
              )}

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${sound.bgColor} ${sound.color} flex items-center justify-center text-2xl transition-transform group-hover:scale-110 duration-500`}>
                      <i className={`fas ${sound.icon}`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">{sound.name}</h3>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${state.isPlaying ? 'text-indigo-500' : 'text-slate-400'}`}>
                        {state.isPlaying ? 'Active' : 'Muted'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleSound(sound.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      state.isPlaying 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <i className={`fas ${state.isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{state.volume}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={state.volume}
                    onChange={(e) => updateVolume(sound.id, parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advice Section */}
      <div className="bg-indigo-50/50 rounded-[3rem] p-10 border border-indigo-100 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 shrink-0 shadow-lg">
             <i className="fas fa-brain text-3xl"></i>
          </div>
          <div className="space-y-3 text-center md:text-left">
            <h4 className="text-xl font-black text-slate-800">Pro Tip: Layer Your Focus</h4>
            <p className="text-slate-500 font-medium leading-relaxed">
              Research suggests that <strong>moderate ambient noise</strong> can enhance creativity. 
              Try mixing 30% <span className="text-blue-500 font-bold">Rain</span> with 20% <span className="text-amber-600 font-bold">Café</span> for the ultimate cozy productivity vibe.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Stay in your flow state</p>
      </div>
    </div>
  );
};
