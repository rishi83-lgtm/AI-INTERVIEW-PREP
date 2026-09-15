import { Router } from 'express';
import OpenAI from 'openai';
import axios from 'axios';

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
    const messages=[{role:'system',content:'You are InterviewIQ, a warm, helpful AI interview coach. Greet first-time users naturally. Answer questions accurately and clearly. For technical questions include a concise example; for behavioral questions use STAR guidance. If unsure, say so rather than inventing facts.'},...history,{role:'user',content:question}];
    if(process.env.GROQ_API_KEY){const response=await axios.post('https://api.groq.com/openai/v1/chat/completions',{model:process.env.GROQ_MODEL||'openai/gpt-oss-20b',messages,temperature:.7,max_tokens:900},{headers:{Authorization:`Bearer ${process.env.GROQ_API_KEY}`},timeout:25000});const answer=response.data?.choices?.[0]?.message?.content?.trim();if(!answer)throw new Error('The AI provider returned an empty response.');return res.json({success:true,data:{answer,source:'groq'}})}
    if (!process.env.OPENAI_API_KEY) return res.json({ success: true, data: { answer: fallback(question), source: 'local-fallback' } });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 20000 });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5',
      instructions: messages[0].content,
      input: messages.slice(1).map(item=>`${item.role}: ${item.content}`).join('\n'),
      max_output_tokens: 700,
    });
    res.json({ success: true, data: { answer: response.output_text, source: 'openai' } });
  } catch (error) { next(error); }
});

export default router;
