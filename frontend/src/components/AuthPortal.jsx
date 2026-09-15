import { useEffect, useState } from 'react';
import { ArrowRight, AtSign, BarChart3, Bot, BrainCircuit, ChevronRight, Eye, EyeOff, Lock, Mail, Moon, ShieldCheck, Sparkles, Star, Sun, User, Zap } from 'lucide-react';
import './AuthPortal.css';

const features = [
  { icon: BrainCircuit, title: 'AI Resume Analysis', desc: 'Instant feedback on resume scoring, missing keywords, and role-fit alignment.', stats: '98% Match Accuracy' },
  { icon: Bot, title: 'Simulated Live Interviews', desc: 'Practice role-specific mock technical and behavioral interviews with real-time voice AI.', stats: '50,000+ Sessions' },
  { icon: BarChart3, title: 'Personalized Prep Plans', desc: 'Curated daily goals tailored to your target companies and role.', stats: '3.5x Higher Hire Rate' }
];

export default function AuthPortal({ initialView = 'signin', onLogin, onRegister }) {
  const [view, setView] = useState(initialView);
  const [dark, setDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });

  useEffect(() => {
    const timer = window.setInterval(() => setActiveFeature(current => (current + 1) % features.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (view === 'signin') await onLogin({ identifier: form.email, password: form.password });
      else await onRegister({ name: form.fullName, username: form.username, email: form.email, password: form.password });
    } catch (requestError) {
      setError(requestError.response?.data?.message || (view === 'signin' ? 'Unable to sign in.' : 'Could not create account.'));
    } finally {
      setLoading(false);
    }
  };

  return <main className={`auth-modern ${dark ? 'auth-modern-dark' : ''}`}>
    <div className="auth-ambient"><i /><i /><i /></div>
    <button className="auth-theme" type="button" onClick={() => setDark(current => !current)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button>
    <section className="auth-portal">
      <aside className="auth-showcase">
        <div>
          <div className="auth-logo"><span><Sparkles /></span><b>InterviewIQ</b></div>
          <div className="auth-intro"><small><Zap /> Next-Gen AI Interview Coach</small><h1>Interview practice,<br /><em>made personal.</em></h1><p>Analyze your resume, rehearse realistic questions, and build a high-converting interview preparation plan.</p></div>
          <div className="auth-features">{features.map((feature, index) => { const Icon = feature.icon; return <button type="button" key={feature.title} onClick={() => setActiveFeature(index)} className={activeFeature === index ? 'active' : ''}><span className="feature-icon"><Icon /></span><span><strong>{feature.title}</strong><small>{feature.desc}</small></span><b>{feature.stats}</b></button>; })}</div>
        </div>
        <footer><span><ShieldCheck /> Private &amp; Encrypted</span><span><Star /> <b>4.9/5</b> (10k+ candidates)</span></footer>
      </aside>
      <div className="auth-form-panel">
        <nav className="auth-tabs"><button type="button" onClick={() => setView('welcome')} className={view === 'welcome' ? 'active' : ''}>Overview</button><button type="button" onClick={() => setView('signin')} className={view === 'signin' ? 'active warm' : ''}>Sign In</button><button type="button" onClick={() => setView('signup')} className={view === 'signup' ? 'active' : ''}>Create Account</button></nav>
        {view === 'welcome' && <div className="auth-view"><h2>Get Started</h2><p>Choose how you&apos;d like to access your InterviewIQ workspace.</p><button className="auth-primary" type="button" onClick={() => setView('signup')}><span><Sparkles /> Create your workspace</span><ArrowRight /></button><button className="auth-secondary" type="button" onClick={() => setView('signin')}>Sign in to existing workspace <ChevronRight /></button><div className="auth-private">Your interview history and preferences stay private to your account.</div></div>}
        {view !== 'welcome' && <form className="auth-view" onSubmit={submit}><h2>{view === 'signin' ? 'Welcome back' : 'Create your workspace'}</h2><p>{view === 'signin' ? 'Sign in to continue preparing with focus.' : 'Get a focused plan for your next opportunity.'}</p>{error && <div className="auth-error">{error}</div>}
          {view === 'signup' && <Field icon={User} name="fullName" label="Full name" placeholder="Alex Morgan" value={form.fullName} onChange={update} />}
          {view === 'signup' && <Field icon={AtSign} name="username" label="Username" placeholder="your.name" minLength="3" value={form.username} onChange={update} />}
          <Field icon={Mail} name="email" label={view === 'signin' ? 'Email or username' : 'Email address'} type={view === 'signin' ? 'text' : 'email'} placeholder={view === 'signin' ? 'you@company.com' : 'alex@domain.com'} value={form.email} onChange={update} />
          <Field icon={Lock} name="password" label="Password" type={showPassword ? 'text' : 'password'} placeholder={view === 'signin' ? 'Your password' : 'At least 8 characters'} minLength={view === 'signup' ? '8' : undefined} value={form.password} onChange={update} trailing={<button type="button" onClick={() => setShowPassword(current => !current)} aria-label="Toggle password visibility">{showPassword ? <EyeOff /> : <Eye />}</button>} />
          <button className="auth-primary auth-submit" disabled={loading} type="submit">{loading ? <span className="auth-spinner" /> : <><span>{view === 'signin' ? 'Sign in' : 'Create account'}</span><ArrowRight /></>}</button>
          <div className="auth-switch">{view === 'signin' ? <>New to InterviewIQ? <button type="button" onClick={() => setView('signup')}>Create account</button></> : <>Already have an account? <button type="button" onClick={() => setView('signin')}>Sign in</button></>}</div>
        </form>}
      </div>
    </section>
  </main>;
}

function Field({ icon: Icon, trailing, label, ...props }) { return <label className="auth-field"><span>{label}</span><div><Icon /> <input required {...props} />{trailing}</div></label>; }