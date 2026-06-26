import React, { useState } from 'react';

export function SettingsModal({ settings, onSave, onClose }) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const InputField = ({ label, name, value }) => (
    <div className="space-y-2">
      <label className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider">{label}</label>
      <input
        type="number"
        min="1"
        max="120"
        value={value}
        onChange={(e) => setFormData({ ...formData, [name]: parseInt(e.target.value) || 1 })}
        className="sketch-input w-full text-lg font-heading font-bold"
      />
    </div>
  );

  const ToggleField = ({ label, name, value }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-body text-ink dark:text-chalk">{label}</span>
      <button
        type="button"
        onClick={() => setFormData({ ...formData, [name]: !value })}
        className={`sketch-toggle ${value ? 'active' : ''}`}
      >
        <div className="toggle-knob"></div>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-ink/40 dark:bg-ink/60 animate-fade-in">
      <div className="sketch-card ink-shadow-lg w-full max-w-xl overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="p-6 border-b-2 border-ink-faint dark:border-ink-light/20 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-ink dark:text-chalk flex items-center gap-2">
              <i className="fas fa-sliders text-accent text-lg"></i>
              Preferences
            </h2>
            <p className="text-xs font-body text-ink-light dark:text-chalk-dim mt-0.5">Configure your sanctuary</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-sketch border-2 border-ink-faint dark:border-ink-light/20 flex items-center justify-center text-ink-light dark:text-chalk-dim hover:border-ink dark:hover:border-chalk hover:text-ink dark:hover:text-chalk transition-all">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-8">
            {/* Duration Section */}
            <section>
              <h3 className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider mb-4">Duration (Minutes)</h3>
              <div className="sketch-divider mb-4 w-32"></div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Focus" name="focusDuration" value={formData.focusDuration} />
                <InputField label="Short Break" name="shortBreakDuration" value={formData.shortBreakDuration} />
                <InputField label="Long Break" name="longBreakDuration" value={formData.longBreakDuration} />
                <InputField label="Deep Work" name="deepWorkDuration" value={formData.deepWorkDuration} />
              </div>
            </section>

            {/* Automation Section */}
            <section className="space-y-3">
              <h3 className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider mb-2">Automation & Tone</h3>
              <div className="sketch-divider mb-4 w-32"></div>
              <InputField label="Rounds before Long Break" name="roundsBeforeLongBreak" value={formData.roundsBeforeLongBreak} />
              <div className="space-y-1 pt-3">
                <ToggleField label="Continuous Flow (Auto-start)" name="autoStartNextSession" value={formData.autoStartNextSession} />
                <ToggleField label="Audible Cues" name="soundEnabled" value={formData.soundEnabled} />
              </div>
            </section>

            {/* Theme Section */}
            <section>
              <h3 className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider mb-3">Atmosphere</h3>
              <div className="sketch-divider mb-4 w-32"></div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: 'light' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sketch border-2 font-heading font-bold transition-all ${
                    formData.theme === 'light'
                      ? 'border-ink dark:border-chalk text-ink dark:text-chalk bg-ink/5 dark:bg-chalk/5'
                      : 'border-ink-faint dark:border-ink-light/20 text-ink-light dark:text-chalk-dim'
                  }`}
                >
                  <i className="fas fa-sun text-sm"></i> Cream Paper
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: 'dark' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sketch border-2 font-heading font-bold transition-all ${
                    formData.theme === 'dark'
                      ? 'border-ink dark:border-chalk text-ink dark:text-chalk bg-ink/5 dark:bg-chalk/5'
                      : 'border-ink-faint dark:border-ink-light/20 text-ink-light dark:text-chalk-dim'
                  }`}
                >
                  <i className="fas fa-moon text-sm"></i> Charcoal
                </button>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sketch-btn-outline py-3 text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] sketch-btn py-3 text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
