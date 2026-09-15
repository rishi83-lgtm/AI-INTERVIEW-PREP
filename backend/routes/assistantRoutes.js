import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const fallback = (question) => {
  const text = question.toLowerCase();
  if (text.includes('tell me about yourself') || text.includes('introduce yourself')) return 'Use a 60–90 second structure: 1) your current background, 2) one or two relevant strengths or projects, and 3) why this role is the next logical step. Example: “I am a frontend developer focused on React and accessible UI. In my recent project I improved dashboard load time by 30%. I am now looking for a role where I can build user-facing products and grow with a strong engineering team.”';
  if (text.includes('closure')) return 'A closure is created when a function remembers variables from the scope where it was created, even after that outer function has returned. Example: `function counter(){ let count = 0; return () => ++count; } const next = counter(); next(); // 1, next(); // 2`. The returned function closes over `count`, so the value stays private and available between calls.';
  if (text.includes('react')) return 'For a React interview answer, start with the concept, then explain the trade-off, then give a real example. Mention component state versus props, rendering behavior, and how you prevent unnecessary work with stable keys, memoization only when measured, and sensible component boundaries.';
  if (text.includes('strength') || text.includes('weakness') || text.includes('behavioral') || text.includes('situation')) return 'Answer behavioral questions with STAR: Situation (brief context), Task (your responsibility), Action (what you specifically did), and Result (measurable outcome). Keep the Situation short and spend most of the answer on your decisions and impact.';
  return `Here is a practical way to answer “${question}”: define the main idea in one sentence, explain how it works in 2–3 points, give one concrete example from a project, and finish with a trade-off or result. If you share your draft answer, I can help you make it clearer and more interview-ready.`;
};

router.post('/ask', async (req, res, next) => {
  try {
    const question = String(req.body.question || '').trim();
    if (!question || question.length > 4000) return res.status(400).json({ success: false, message: 'Enter a question under 4,000 characters.' });
    const history=Array.isArray(req.body.messages)?req.body.messages.slice(-10).filter(item=>['user','assistant'].includes(item?.role)&&typeof item.content==='string'&&item.content.length<=4000).map(item=>({role:item.role,content:item.content})):[];
    const messages=[{role:'system',content:'You are InterviewIQ, a helpful general-purpose AI assistant. Answer any safe question clearly, accurately, and in the user\'s language when possible. Adapt the depth and format to the question. For technical topics, explain concepts and include concise examples when useful. For current or uncertain facts, be transparent about limitations and never invent sources or claims. You may also help with interview preparation, coding, writing, learning, planning, and everyday questions.'},...history,{role:'user',content:question}];
    if (!process.env.OPENAI_API_KEY) return res.json({ success: true, data: { answer: fallback(question), source: 'local-fallback' } });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 20000 });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 900,
    });
    const answer=response.choices[0]?.message?.content?.trim();
    if(!answer) throw new Error('OpenAI returned an empty response.');
    res.json({ success: true, data: { answer, source: 'openai' } });
  } catch (error) { next(error); }
});

export default router;
