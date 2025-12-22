
import React, { useState } from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState<Settings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const InputField = ({ label, name, value }: { label: string, name: keyof Settings, value: number }) => (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="number" 
        min="1" 
        max="120"
        value={value}
        onChange={(e) => setFormData({ ...formData, [name]: parseInt(e.target.value) || 1 })}
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-700 dark:text-slate-100 outline-none focus:border-indigo-500 transition-colors font-bold"
      />
    </div>
  );

  const ToggleField = ({ label, name, value }: { label: string, name: keyof Settings, value: boolean }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{label}</span>
      <button 
        type="button"
        onClick={() => setFormData({ ...formData, [name]: !value })}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'right-1' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-full">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <i className="fas fa-sliders text-indigo-600"></i>
              Preference
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure your sanctum</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 active:scale-90">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-10">
            <section>
              <h3 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-6">Duration (Minutes)</h3>
              <div className="grid grid-cols-2 gap-6">
                <InputField label="Focus" name="focusDuration" value={formData.focusDuration} />
                <InputField label="Short Break" name="shortBreakDuration" value={formData.shortBreakDuration} />
                <InputField label="Long Break" name="longBreakDuration" value={formData.longBreakDuration} />
                <InputField label="Deep Work" name="deepWorkDuration" value={formData.deepWorkDuration} />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-2">Automation & Tone</h3>
              <InputField label="Rounds before Long Break" name="roundsBeforeLongBreak" value={formData.roundsBeforeLongBreak} />
              <div className="space-y-4 pt-4">
                <ToggleField label="Continuous Flow (Auto-start)" name="autoStartNextSession" value={formData.autoStartNextSession} />
                <ToggleField label="Audible Cues" name="soundEnabled" value={formData.soundEnabled} />
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] mb-4">Atmosphere</h3>
              <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, theme: 'light'})}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${formData.theme === 'light' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
                >
                  <i className="fas fa-sun"></i> Light
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, theme: 'dark'})}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-bold transition-all ${formData.theme === 'dark' ? 'bg-slate-700 text-indigo-400 shadow-md' : 'text-slate-400'}`}
                >
                  <i className="fas fa-moon"></i> Dark
                </button>
              </div>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-2xl font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all uppercase text-[10px] tracking-widest"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-indigo-700 dark:bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-800 dark:hover:bg-indigo-500 transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em]"
            >
              Seal Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
