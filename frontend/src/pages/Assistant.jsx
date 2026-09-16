import { Bot, CornerDownLeft, Paperclip, Sparkles, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const suggestions = [
  'Explain closures using a simple example',
  'Help me answer “Tell me about yourself”',
  'Give me feedback on a React interview answer',
];

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I’m InterviewIQ, your AI interview coach. Tell me the role you are preparing for, or ask me anything—from technical concepts to mock answers.',
    },
  ]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFilesSelected = (event) => {
    const incoming = Array.from(event.target.files || []);
    if (!incoming.length) return;

    setAttachments((current) => {
      const merged = [...current];
      incoming.forEach((file) => {
        const exists = merged.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        );
        if (!exists) merged.push(file);
      });
      return merged;
    });

    event.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const ask = async (value = question) => {
    const text = value.trim();
    if ((!text && attachments.length === 0) || loading) return;

    const prior = messages;
    const payloadQuestion =
      text ||
      (attachments.length
        ? `Please review these uploaded files: ${attachments.map((file) => file.name).join(', ')}`
        : '');

    setMessages([...prior, { role: 'user', content: payloadQuestion }]);
    setQuestion('');
    setAttachments([]);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('question', payloadQuestion);
      formData.append('messages', JSON.stringify(prior));

      attachments.forEach((file) => {
        formData.append('files', file);
      });

      const response = await api.post('/assistant/ask', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: response.data.data.answer },
      ]);
    } catch (err) {
      setMessages(prior);
      setError(err.response?.data?.message || 'The coach could not respond just now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Ask InterviewIQ">
      <div className="assistant-page">
        <section className="assistant-intro">
          <div className="assistant-orb">
            <Bot size={32} />
          </div>
          <span className="eyebrow">
            <Sparkles size={14} /> AI INTERVIEW COACH
          </span>
          <h2>Ask anything. Practice with confidence.</h2>
          <p>
            Get concise explanations, answer frameworks, or follow-up questions for your next
            interview.
          </p>
        </section>

        <section className="assistant-chat">
          <div className="chat-window">
            {messages.map((message, index) => (
              <div
                className={message.role === 'user' ? 'user-answer' : 'ai-answer'}
                key={`${message.role}-${index}`}
              >
                <div className="message-label">
                  {message.role === 'assistant' ? (
                    <>
                      <Bot size={16} /> InterviewIQ
                    </>
                  ) : (
                    'You'
                  )}
                </div>
                <p>{message.content}</p>
              </div>
            ))}

            {loading && (
              <div className="typing">
                <i />
                <i />
                <i /> InterviewIQ is thinking…
              </div>
            )}

            {error && <p className="error">{error}</p>}
          </div>

          {attachments.length > 0 && (
            <div className="attachment-row" aria-live="polite">
              {attachments.map((file, index) => (
                <div className="file-pill" key={`${file.name}-${file.lastModified || index}`}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => removeAttachment(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            className="ask-form"
            onSubmit={(event) => {
              event.preventDefault();
              ask();
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.png,.jpg,.jpeg,.ppt,.pptx,application/pdf,image/*"
              style={{ display: 'none' }}
              onChange={handleFilesSelected}
            />

            <button
              type="button"
              className="attach-button"
              aria-label="Attach files"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </button>

            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask an interview question or upload a PDF, doc, or image…"
              rows="2"
            />

            <button
              aria-label="Send question"
              disabled={loading || (!question.trim() && attachments.length === 0)}
            >
              <CornerDownLeft size={18} />
            </button>
          </form>
        </section>

        <div className="suggestion-row">
          {suggestions.map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => ask(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
