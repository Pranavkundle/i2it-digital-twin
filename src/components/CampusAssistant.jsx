import { useState } from 'react';

export default function CampusAssistant({ open, onClose, onNavigate, answer }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const send = (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { who: 'user', text: q }]);
    setInput('');
    const result = answer(q);
    setMessages((m) => [
      ...m,
      { who: 'bot', text: result.answer, navigate: result.navigate },
    ]);
    if (result.navigate) onNavigate(result.navigate);
  };

  if (!open) return null;

  return (
    <div className="assistant-panel" role="dialog" aria-label="Campus Assistant">
      <header>
        <div>
          <strong>Campus Assistant</strong>
          <span className="assistant-label">Prototype / Local Campus Knowledge</span>
        </div>
        <button type="button" className="icon" onClick={onClose} aria-label="Close">×</button>
      </header>
      <div className="assistant-messages">
        {messages.length === 0 && (
          <p className="muted">
            Try: &quot;Where is the TPO office?&quot; or &quot;How many floors does the Academic Building have?&quot;
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.who}`}>
            <span className="who">{msg.who === 'user' ? 'You' : 'Assistant'}</span>
            {msg.text}
            {msg.navigate && msg.who === 'bot' && (
              <button
                type="button"
                className="link-btn"
                onClick={() => onNavigate(msg.navigate)}
              >
                View location
              </button>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Where is the TPO office?"
        />
        <button type="submit">Ask</button>
      </form>
    </div>
  );
}
