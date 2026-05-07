// Top-level app: tabs to pick a wireframe, state switcher, tweaks.

const { useState, useEffect } = React;

const WIREFRAMES = [
  {
    id: 'classic',
    title: 'Classic bubbles',
    blurb: 'Conventional messenger pattern: full-screen chat, bubbles aligned left/right, fixed input at the bottom. Familiar and predictable — works for the 95% case.',
    Comp: window.WF1Classic,
  },
  {
    id: 'cards',
    title: 'Q&A card stack',
    blurb: 'Each question is a card with answer underneath, more like a stacked document than a chat. Reads better for long answers, dedupes the “speech bubble” feel and treats normix less like a person.',
    Comp: window.WF2Cards,
  },
  {
    id: 'hero',
    title: 'Hero search → chat',
    blurb: 'Empty state is a centered hero (Google-y). Once the user asks, the input docks to the bottom and the page becomes a chat with avatars. Strong first impression that fades into utility.',
    Comp: window.WF3Hero,
  },
];

const STATES = [
  { id: 'empty', label: 'empty' },
  { id: 'convo', label: 'conversation' },
  { id: 'loading', label: 'loading' },
  { id: 'error', label: 'error' },
];

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "wireframe": "classic",
  "state": "empty",
  "accent": "orange",
  "showSuggestions": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(DEFAULTS);
  const wf = WIREFRAMES.find(w => w.id === tweaks.wireframe) || WIREFRAMES[0];
  const Comp = wf.Comp;

  return (
    <div>
      <header className="page">
        <div>
          <h1>normix — wireframes</h1>
          <div className="sub">
            three rough directions for the chatbot frontend. low-fi on purpose — focus on layout & flow, not pixels. switch between them with the tabs.
          </div>
        </div>
        <div className="lo-fi-hint" style={{ fontSize: 18 }}>
          v0 · {WIREFRAMES.length} options · 4 states each
        </div>
      </header>

      {/* tabs */}
      <div className="tabs">
        <span className="label">direction:</span>
        {WIREFRAMES.map((w, i) => (
          <button
            key={w.id}
            className="ink-btn"
            aria-pressed={tweaks.wireframe === w.id}
            onClick={() => setTweak('wireframe', w.id)}
          >
            {String(i+1).padStart(2,'0')} · {w.title}
          </button>
        ))}
      </div>

      {/* state switcher */}
      <div className="states">
        <span className="label">state:</span>
        {STATES.map(s => (
          <button
            key={s.id}
            className="ink-btn"
            aria-pressed={tweaks.state === s.id}
            onClick={() => setTweak('state', s.id)}
          >
            {s.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span className="lo-fi-hint">accent:</span>
        <button
          className="ink-btn"
          aria-pressed={tweaks.accent === 'orange'}
          onClick={() => setTweak('accent', 'orange')}
          style={{ background: tweaks.accent === 'orange' ? 'var(--orange)' : '#fff' }}
        >orange</button>
        <button
          className="ink-btn"
          aria-pressed={tweaks.accent === 'teal'}
          onClick={() => setTweak('accent', 'teal')}
          style={{
            background: tweaks.accent === 'teal' ? 'var(--teal)' : '#fff',
            color: tweaks.accent === 'teal' ? '#fff' : 'var(--ink)',
          }}
        >teal</button>
        <button
          className="ink-btn"
          aria-pressed={tweaks.showSuggestions}
          onClick={() => setTweak('showSuggestions', !tweaks.showSuggestions)}
        >
          {tweaks.showSuggestions ? '✓ suggested Qs' : '✗ suggested Qs'}
        </button>
      </div>

      {/* artboard */}
      <div className="artboard-wrap">
        <div className="artboard-caption">
          <span><b>{wf.title}</b> — {tweaks.state}</span>
          <span>1440 × auto · low-fi</span>
        </div>
        <div className="artboard">
          <Comp
            state={tweaks.state}
            accent={tweaks.accent}
            showSuggestions={tweaks.showSuggestions}
          />
        </div>
        <div className="why">
          <b>why this direction</b>
          <div style={{ marginTop: 4 }}>{wf.blurb}</div>
        </div>
      </div>

      {/* Tweaks panel (toolbar toggle) */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Wireframe">
          <window.TweakRadio
            label="direction"
            value={tweaks.wireframe}
            options={WIREFRAMES.map(w => ({ value: w.id, label: w.title }))}
            onChange={(v) => setTweak('wireframe', v)}
          />
        </window.TweakSection>
        <window.TweakSection title="State">
          <window.TweakRadio
            label="screen state"
            value={tweaks.state}
            options={STATES.map(s => ({ value: s.id, label: s.label }))}
            onChange={(v) => setTweak('state', v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Style">
          <window.TweakRadio
            label="accent"
            value={tweaks.accent}
            options={[
              { value: 'orange', label: 'orange' },
              { value: 'teal', label: 'teal' },
            ]}
            onChange={(v) => setTweak('accent', v)}
          />
          <window.TweakToggle
            label="show suggested questions"
            value={tweaks.showSuggestions}
            onChange={(v) => setTweak('showSuggestions', v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
