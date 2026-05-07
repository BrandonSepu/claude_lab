// Three low-fi wireframes for normix. Each is a self-contained component.
// All exports go on window so app.jsx can use them.

const SUGGESTED = [
  "¿Qué es la Ley Fintech?",
  "¿Cómo registro una operación?",
  "Requisitos de KYC",
  "¿Qué reporta la CNBV?",
];

const SAMPLE_QUESTION = "¿Qué requisitos pide la Ley Fintech para una IFPE?";
const SAMPLE_ANSWER =
  "Una Institución de Fondos de Pago Electrónico (IFPE) necesita autorización de la CNBV, capital mínimo, manuales de operación y un sistema de gestión de riesgos. El trámite se presenta ante la Comisión y suele tomar varios meses.";

// ============================================================
// Wireframe 1 — Classic centered chat with bubbles
// ============================================================
function WF1Classic({ state, accent, showSuggestions }) {
  const accentVar = accent === 'teal' ? 'var(--teal)' : 'var(--orange)';
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--paper)',
      position: 'relative',
    }}>
      {/* top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 22px',
        borderBottom: '2px dashed var(--rule)',
      }}>
        <div className="logo-mark small" style={{ background: 'var(--teal-soft)' }}>n</div>
        <span className="scrawl" style={{ fontSize: 28 }}>normix</span>
        <span className="lo-fi-hint" style={{ marginLeft: 'auto' }}>— full screen chat —</span>
      </div>

      {/* message area */}
      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '24px 18% 18px 18%',
        display: 'flex', flexDirection: 'column',
      }}>
        {state === 'empty' && (
          <div style={{
            margin: 'auto', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
          }}>
            <div className="logo-mark">n</div>
            <div className="scrawl zig" style={{ fontSize: 38 }}>Hola, soy normix</div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 16 }}>
              Pregúntame lo que sea sobre regulación fintech.
            </div>
            {showSuggestions && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 10, marginTop: 8, maxWidth: 520, width: '100%',
              }}>
                {SUGGESTED.map((s, i) => (
                  <div key={i} className="suggest-chip">{s}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {(state === 'convo' || state === 'loading' || state === 'error') && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            justifyContent: 'flex-end', flex: 1,
          }}>
            <div className="bubble-user">{SAMPLE_QUESTION}</div>
            {state !== 'loading' && (
              <div className="bubble-bot">{SAMPLE_ANSWER}</div>
            )}
            {state === 'convo' && (
              <div className="bubble-user">¿Y el capital mínimo?</div>
            )}
            {state === 'loading' && (
              <div className="bubble-bot" style={{ width: 'fit-content' }}>
                <div className="typing-dots"><span/><span/><span/></div>
              </div>
            )}
            {state === 'error' && (
              <div className="error-banner">
                Error al consultar el servicio. Inténtalo de nuevo.
              </div>
            )}
          </div>
        )}
      </div>

      {/* input bar */}
      <div style={{
        padding: '14px 18% 22px 18%',
        borderTop: '2px solid var(--rule)',
        background: 'var(--teal-soft)',
      }}>
        <div className="input-row">
          <div className="input-fake">Escribe tu pregunta...</div>
          <button className="send-btn" style={{ background: accentVar }}>Enviar</button>
        </div>
      </div>

      {/* annotations */}
      {state === 'empty' && (
        <div className="annot" style={{ top: 110, right: 28, transform: 'rotate(4deg)', textAlign: 'right' }}>
          logo + saludo<br/><span className="arrow">↘</span>
        </div>
      )}
      <div className="annot" style={{ bottom: 90, left: 28, transform: 'rotate(-3deg)' }}>
        <span className="arrow">↙</span> input fijo<br/>(Enter envía)
      </div>
    </div>
  );
}

// ============================================================
// Wireframe 2 — Q&A card stack (no bubbles, more document-y)
// ============================================================
function WF2Cards({ state, accent, showSuggestions }) {
  const accentVar = accent === 'teal' ? 'var(--teal)' : 'var(--orange)';
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: '#faf6ec',
      position: 'relative',
    }}>
      {/* top bar */}
      <div style={{
        padding: '16px 24px 10px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div className="logo-mark small">n</div>
        <span className="scrawl" style={{ fontSize: 28 }}>normix</span>
        <span className="lo-fi-hint" style={{ marginLeft: 'auto' }}>— Q&A as cards —</span>
      </div>

      {/* content */}
      <div style={{
        flex: 1, overflow: 'hidden',
        padding: '8px 14% 18px 14%',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {state === 'empty' && (
          <div style={{
            margin: 'auto', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div className="scrawl zig" style={{ fontSize: 44 }}>¿Qué quieres saber?</div>
            <div style={{ color: 'var(--ink-soft)' }}>Escribe abajo o prueba con una de estas:</div>
            {showSuggestions && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 10,
                justifyContent: 'center', maxWidth: 560, marginTop: 6,
              }}>
                {SUGGESTED.map((s, i) => (
                  <div key={i} className="suggest-chip" style={{ borderRadius: 999 }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {(state === 'convo' || state === 'loading' || state === 'error') && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            overflow: 'hidden', flex: 1,
            justifyContent: 'flex-end',
          }}>
            {/* Q&A card */}
            <div className="scribble-border" style={{ padding: '14px 18px' }}>
              <div className="scrawl" style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 4 }}>
                <span style={{ color: accentVar }}>P.</span> {SAMPLE_QUESTION}
              </div>
              <div style={{ height: 2, background: 'var(--rule)', opacity: .15, margin: '8px 0 10px' }} />
              {state === 'loading' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="scrawl" style={{ fontSize: 24, color: 'var(--teal)' }}>R.</span>
                  <div className="typing-dots"><span/><span/><span/></div>
                  <span className="lo-fi-hint">pensando...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <span className="scrawl" style={{ fontSize: 24, color: 'var(--teal)' }}>R.</span>
                  <div style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ink)' }}>
                    {SAMPLE_ANSWER}
                  </div>
                </div>
              )}
            </div>

            {state === 'convo' && (
              <div className="scribble-border" style={{ padding: '14px 18px', opacity: .55 }}>
                <div className="scrawl" style={{ fontSize: 24 }}>
                  <span style={{ color: accentVar }}>P.</span> ¿Y el capital mínimo?
                </div>
                <div className="rule" style={{ marginTop: 10 }} />
                <div className="rule short" style={{ marginTop: 8 }} />
              </div>
            )}

            {state === 'error' && (
              <div className="error-banner">
                Error al consultar el servicio. Inténtalo de nuevo.
              </div>
            )}
          </div>
        )}
      </div>

      {/* input bar — pill */}
      <div style={{ padding: '12px 14% 22px 14%' }}>
        <div className="scribble-border" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: 6, paddingLeft: 16,
          borderRadius: '999px',
          background: '#fff',
        }}>
          <div style={{ flex: 1, color: 'var(--ink-muted)', fontSize: 16 }}>
            Escribe tu pregunta...
          </div>
          <button className="send-btn" style={{
            background: accentVar, borderRadius: 999, padding: '8px 18px',
          }}>Enviar →</button>
        </div>
      </div>

      <div className="annot" style={{ top: 70, right: 30, transform: 'rotate(2deg)' }}>
        cada Q&A es una<br/>tarjeta apilada <span className="arrow">↓</span>
      </div>
    </div>
  );
}

// ============================================================
// Wireframe 3 — Hero-search → conversation grows below
// ============================================================
function WF3Hero({ state, accent, showSuggestions }) {
  const accentVar = accent === 'teal' ? 'var(--teal)' : 'var(--orange)';
  const isEmpty = state === 'empty';
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--paper)',
      position: 'relative',
    }}>
      {/* tiny top bar always */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 22px',
      }}>
        <div className="logo-mark small">n</div>
        <span className="scrawl" style={{ fontSize: 24 }}>normix</span>
        <span className="lo-fi-hint" style={{ marginLeft: 'auto' }}>
          — search-first, becomes chat —
        </span>
      </div>

      {/* hero empty state: input is centered */}
      {isEmpty && (
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 14%', gap: 22,
        }}>
          <div className="logo-mark" style={{ width: 110, height: 110, fontSize: 56 }}>n</div>
          <div className="scrawl" style={{ fontSize: 46, lineHeight: 1 }}>
            <span className="zig">normix</span>
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 16, marginTop: -10 }}>
            tu copiloto de regulación fintech
          </div>
          <div className="scribble-border" style={{
            width: '100%', maxWidth: 620,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: 8, paddingLeft: 18,
          }}>
            <div style={{ flex: 1, color: 'var(--ink-muted)', fontSize: 18 }}>
              Escribe tu pregunta...
            </div>
            <button className="send-btn" style={{ background: accentVar }}>Enviar</button>
          </div>
          {showSuggestions && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10,
              justifyContent: 'center', maxWidth: 620,
            }}>
              {SUGGESTED.map((s, i) => (
                <div key={i} className="suggest-chip">{s}</div>
              ))}
            </div>
          )}
          <div className="annot" style={{ bottom: 60, left: '50%', transform: 'translateX(-50%) rotate(-1deg)' }}>
            <span className="arrow">↑</span> al enviar, el input baja y aparece la conversación
          </div>
        </div>
      )}

      {/* convo / loading / error: input docked to bottom */}
      {!isEmpty && (
        <>
          <div style={{
            flex: 1, overflow: 'hidden',
            padding: '14px 14% 14px 14%',
            display: 'flex', flexDirection: 'column', gap: 12,
            justifyContent: 'flex-end',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div className="logo-mark small" style={{
                background: 'var(--orange-soft)', flexShrink: 0,
              }}>tú</div>
              <div className="bubble-user" style={{ alignSelf: 'auto', maxWidth: '80%' }}>
                {SAMPLE_QUESTION}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div className="logo-mark small" style={{ flexShrink: 0 }}>n</div>
              {state === 'loading' && (
                <div className="bubble-bot" style={{ alignSelf: 'auto' }}>
                  <div className="typing-dots"><span/><span/><span/></div>
                </div>
              )}
              {state === 'convo' && (
                <div className="bubble-bot" style={{ alignSelf: 'auto', maxWidth: '80%' }}>
                  {SAMPLE_ANSWER}
                </div>
              )}
              {state === 'error' && (
                <div className="error-banner" style={{ flex: 1 }}>
                  Error al consultar el servicio. Inténtalo de nuevo.
                </div>
              )}
            </div>
          </div>
          <div style={{
            padding: '14px 14% 22px 14%',
            borderTop: '2px dashed var(--rule)',
          }}>
            <div className="scribble-border" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: 6, paddingLeft: 18, background: '#fff',
            }}>
              <div style={{ flex: 1, color: 'var(--ink-muted)', fontSize: 16 }}>
                Escribe tu pregunta...
              </div>
              <button className="send-btn" style={{ background: accentVar }}>Enviar</button>
            </div>
          </div>
          <div className="annot" style={{ top: 80, right: 30, transform: 'rotate(3deg)' }}>
            avatares a la izquierda<br/>
            <span className="arrow">↙</span>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { WF1Classic, WF2Cards, WF3Hero });
