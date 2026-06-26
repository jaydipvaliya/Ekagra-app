import React, { useState, useEffect } from 'react';

const PLAYLISTS = [
  {
    id: '37i9dQZF1DWWQRwui0ExPn',
    name: 'Lofi Beats',
    description: 'The official Spotify lofi beats for focus, study, and relaxing.',
    icon: 'fa-headphones',
  },
  {
    id: '0vvXsWCC9xrXsKd4FyS8kM',
    name: 'Lofi Girl Study',
    description: "Lofi Girl's official beats to relax, study, and keep your focus.",
    icon: 'fa-book-reader',
  },
  {
    id: '37i9dQZF1DX4sWSpwq3LiO',
    name: 'Peaceful Piano',
    description: 'Beautiful, calming instrumental piano music to help you concentrate.',
    icon: 'fa-music',
  },
  {
    id: '37i9dQZF1DWZeKCadgRdKQ',
    name: 'Deep Focus',
    description: 'Atmospheric ambient sounds and soundscapes to trigger deep work.',
    icon: 'fa-brain',
  }
];

export function Ambience({ initialState, onStateChange }) {
  const [activePlaylistId, setActivePlaylistId] = useState(() => {
    if (initialState) {
      if (typeof initialState === 'object') {
        let savedId = null;
        if (!Array.isArray(initialState) && initialState.selectedPlaylistId) {
          savedId = initialState.selectedPlaylistId;
        } else if (Array.isArray(initialState) && initialState.length > 0 && initialState[0] && initialState[0].playlistId) {
          savedId = initialState[0].playlistId;
        }

        if (savedId) {
          // Map old/inactive IDs to their new working counterparts
          if (savedId === '37i9dQZF1DX88tOC5HSnui') {
            return '0vvXsWCC9xrXsKd4FyS8kM'; // Map old Chill Study to Lofi Girl
          }
          if (savedId === '37i9dQZF1DX0SMZkfk2gAT') {
            return '37i9dQZF1DX4sWSpwq3LiO'; // Map old Jazz Vibes to Peaceful Piano
          }
          
          const validIds = PLAYLISTS.map(p => p.id);
          if (validIds.includes(savedId)) {
            return savedId;
          }
        }
      }
    }
    return '37i9dQZF1DWWQRwui0ExPn'; // Default to Lofi Beats
  });

  useEffect(() => {
    onStateChange({ selectedPlaylistId: activePlaylistId });
  }, [activePlaylistId, onStateChange]);

  const activePlaylist = PLAYLISTS.find(p => p.id === activePlaylistId) || PLAYLISTS[0];

  return (
    <div className="space-y-6 animate-slide-up w-full">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk tracking-tight">Study Radio</h2>
        <p className="text-sm font-body text-ink-light dark:text-chalk-dim">Select your soundtrack and tune into your flow state.</p>
        <div className="sketch-divider mx-auto w-40 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Presets List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider pl-1">
            Choose Station
          </h3>
          <div className="space-y-3">
            {PLAYLISTS.map((playlist) => {
              const isActive = playlist.id === activePlaylistId;
              return (
                <button
                  key={playlist.id}
                  onClick={() => setActivePlaylistId(playlist.id)}
                  className={`w-full text-left sketch-card p-4 transition-all duration-200 group flex items-start gap-4 ${
                    isActive
                      ? 'border-2 border-accent dark:border-accent ink-shadow crosshatch-bg'
                      : 'hover:ink-shadow'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-sketch border-2 flex items-center justify-center text-lg shrink-0 transition-all ${
                    isActive
                      ? 'border-accent text-accent'
                      : 'border-border-color text-ink-light dark:text-chalk-dim group-hover:border-ink dark:group-hover:border-chalk group-hover:text-ink dark:group-hover:text-chalk'
                  }`}>
                    <i className={`fas ${playlist.icon}`}></i>
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-heading font-bold transition-colors ${
                      isActive ? 'text-accent' : 'text-ink dark:text-chalk'
                    }`}>
                      {playlist.name}
                    </h4>
                    <p className="text-xs font-body text-ink-light dark:text-chalk-dim leading-snug">
                      {playlist.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Embed & Notes */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Station Frame */}
          <div className="sketch-card p-4 ink-shadow space-y-3">
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-light/20 pb-2">
              <span className="text-[10px] font-heading font-bold text-accent uppercase tracking-wider">
                Now Tuning...
              </span>
              <span className="text-[10px] font-heading font-bold text-ink dark:text-chalk uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                {activePlaylist.name}
              </span>
            </div>

            {/* Spotify Iframe */}
            <div className="relative overflow-hidden rounded-sketch border border-border-color">
              <iframe
                title={`Spotify Player - ${activePlaylist.name}`}
                src={`https://open.spotify.com/embed/playlist/${activePlaylist.id}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full bg-transparent"
              ></iframe>
            </div>
          </div>

          {/* Quick Annotation Tip */}
          <div className="flex items-start gap-2 px-2">
            <span className="annotation mt-1 shrink-0">Note</span>
            <p className="text-xs font-body text-ink-light dark:text-chalk-dim leading-relaxed">
              For uninterrupted playback of full tracks, please log into Spotify in this browser. You can also click the playlist logo inside the player to open it directly in Spotify.
            </p>
          </div>
        </div>
      </div>

      {/* Pro Tip Notebook Section */}
      <div className="notebook-page p-6 pl-8 mt-8">
        <div className="flex flex-col md:flex-row items-center gap-6 pl-4">
          <div className="w-14 h-14 rounded-sketch border-2 border-border-color flex items-center justify-center text-ink-light dark:text-chalk-dim shrink-0">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-heading font-bold text-ink dark:text-chalk">Pro Tip: Lofi & Focus</h4>
            <p className="text-sm font-body text-ink-light dark:text-chalk-dim leading-relaxed">
              Lofi study music uses repetitious, low-tempo beats (around <strong className="text-ink dark:text-chalk">70-90 BPM</strong>) that mimic human heart rates at rest. This induces a relaxed yet alert state ideal for cognitive task retention, language comprehension, and programming.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-6">
        <p className="text-[10px] font-heading font-bold text-ink-faint dark:text-chalk-dim uppercase tracking-wider">
          stay in your flow state
        </p>
      </div>
    </div>
  );
}
