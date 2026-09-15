import { ArrowRight, BrainCircuit, Code2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';

export default function PracticeMode({ title, subtitle, questions, icon: Icon, accent = 'coding' }) {
  const [selectedId, setSelectedId] = useState(questions[0]?.id ?? null);
  const [answers, setAnswers] = useState(() => Object.fromEntries(questions.map((question) => [question.id, ''])));

  const selected = questions.find((question) => question.id === selectedId) ?? questions[0];
  const currentAnswer = answers[selected?.id] ?? '';

  const progress = Math.round((Object.values(answers).filter((answer) => answer.trim().length > 0).length / questions.length) * 100);

  const updateCurrentAnswer = (value) => {
    setAnswers((previous) => ({ ...previous, [selected.id]: value }));
  };

  return (
    <Layout title={title}>
      <div className="practice-page">
        <section className="practice-hero practice-hero-compact">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> {title.toUpperCase()}</span>
            <h2>{subtitle}</h2>
            <p>Practice with focused questions and write structured answers you can refine over time.</p>
          </div>
          <div className="practice-progress">
            <span>Progress</span>
            <strong>{progress}%</strong>
            <div className="track"><i style={{ width: `${progress}%` }} /></div>
            <small>{questions.length} questions ready</small>
          </div>
        </section>

        <section className="practice-mode-layout">
          <aside className="practice-question-list">
            {questions.map((question) => (
              <button
                key={question.id}
                type="button"
                className={`question-list-item ${selected?.id === question.id ? 'active' : ''}`}
                onClick={() => setSelectedId(question.id)}
              >
                <span className="question-list-top">
                  <strong>{question.title}</strong>
                  <span className={`diff ${question.level.toLowerCase()}`}>{question.level}</span>
                </span>
                <small>{question.summary}</small>
              </button>
            ))}
          </aside>

          <article className="question-stage">
            <div className="question-meta">
              <span className={`category-chip mode-${accent}`}><Icon size={14} /> {selected.category}</span>
              <span>{selected.level}</span>
            </div>

            <h1>{selected.title}</h1>
            <p className="practice-prompt">{selected.prompt}</p>

            <div className="answer-area">
              <label htmlFor="practice-answer">Your response</label>
              <textarea
                id="practice-answer"
                value={currentAnswer}
                onChange={(event) => updateCurrentAnswer(event.target.value)}
                placeholder={selected.placeholder}
              />
            </div>

            <div className="stage-actions">
              <Button variant="secondary" onClick={() => updateCurrentAnswer('')}>Clear</Button>
              <Button>Mark as complete <ArrowRight size={16} /></Button>
            </div>

            <div className="practice-rubric">
              <h3>Focus points</h3>
              <ul>
                {selected.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      </div>
    </Layout>
  );
}
