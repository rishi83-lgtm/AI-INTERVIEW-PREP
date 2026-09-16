import { Router } from 'express';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const pdfParse = pdfParseModule.default || pdfParseModule;

const router = Router();
const fallback = (question) => {
  const text = question.toLowerCase();
  if (text.includes('tell me about yourself') || text.includes('introduce yourself')) return 'Use a 60–90 second structure: 1) your current background, 2) one or two relevant strengths or projects, and 3) why this role is the next logical step. Example: “I am a frontend developer focused on React and accessible UI. In my recent project I improved dashboard load time by 30%. I am now looking for a role where I can build user-facing products and grow with a strong engineering team.”';
  if (text.includes('closure')) return 'A closure is created when a function remembers variables from the scope where it was created, even after that outer function has returned. Example: `function counter(){ let count = 0; return () => ++count; } const next = counter(); next(); // 1, next(); // 2`. The returned function closes over `count`, so the value stays private and available between calls.';
  if (text.includes('react')) return 'For a React interview answer, start with the concept, then explain the trade-off, then give a real example. Mention component state versus props, rendering behavior, and how you prevent unnecessary work with stable keys, memoization only when measured, and sensible component boundaries.';
  if (text.includes('strength') || text.includes('weakness') || text.includes('behavioral') || text.includes('situation')) return 'Answer behavioral questions with STAR: Situation (brief context), Task (your responsibility), Action (what you specifically did), and Result (measurable outcome). Keep the Situation short and spend most of the answer on your decisions and impact.';
  return `Here is a practical way to answer “${question}”: define the main idea in one sentence, explain how it works in 2–3 points, give one concrete example from a project, and finish with a trade-off or result. If you share your draft answer, I can help you make it clearer and more interview-ready.`;
};

const isValidApiKey = (value) => typeof value === 'string' && value.trim().length > 0 && !['your_openai_api_key_here', 'your_gemini_api_key_here', 'replace-with-your-key', 'change-me', 'changeme'].includes(value.trim().toLowerCase());

const buildGeminiContents = (history, question) => {
  const systemPrompt = 'You are InterviewIQ, a helpful general-purpose AI assistant. Answer any safe question clearly, accurately, and in the user\'s language when possible. Adapt the depth and format to the question. For technical topics, explain concepts and include concise examples when useful. For current or uncertain facts, be transparent about limitations and never invent sources or claims. You may also help with interview preparation, coding, writing, learning, planning, and everyday questions.';
  const mappedHistory = Array.isArray(history) ? history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(item.content || '') }],
  })) : [];

  return {
    systemInstruction: systemPrompt,
    contents: [...mappedHistory, { role: 'user', parts: [{ text: question }] }],
  };
};

const extractPdfText = async (file) => {
  const fileName = String(file?.originalname || file?.name || '').toLowerCase();
  if (!file || typeof file !== 'object' || !fileName.endsWith('.pdf')) {
    return '';
  }

  if (!file.buffer || !Buffer.isBuffer(file.buffer)) {
    return '';
  }

  try {
    const data = await pdfParse(file.buffer);
    return String(data?.text || '').trim();
  } catch (error) {
    console.error('PDF parse failed:', error.message);
    return '';
  }
};

const extractDocxText = async (file) => {
  const fileName = String(file?.originalname || file?.name || '').toLowerCase();
  if (!file || !file.buffer || !Buffer.isBuffer(file.buffer) || !fileName.endsWith('.docx')) return '';

  try {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return String(result?.value || '').trim();
  } catch (error) {
    console.error('DOCX parse failed:', error.message);
    return '';
  }
};

const extractTextFile = (file) => {
  if (!file || !file.buffer || !Buffer.isBuffer(file.buffer)) return '';

  const name = String(file.originalname || file.name || '').toLowerCase();
  const mime = String(file.mimetype || '').toLowerCase();

  if (name.endsWith('.pdf') || name.endsWith('.docx') || mime.includes('pdf') || mime.includes('word')) return '';

  try {
    const text = file.buffer.toString('utf8');
    return text.trim();
  } catch (error) {
    return '';
  }
};

const normalizeAttachmentList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeMessageHistory = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const collectUploadedText = async (files = []) => {
  const extracted = [];

  for (const file of files) {
    if (!file) continue;

    const pdfText = await extractPdfText(file);
    if (pdfText) {
      extracted.push(pdfText);
      continue;
    }

    const docxText = await extractDocxText(file);
    if (docxText) {
      extracted.push(docxText);
      continue;
    }

    const textContent = extractTextFile(file);
    if (textContent) {
      extracted.push(textContent);
    }
  }

  return extracted.filter(Boolean).join('\n\n---\n\n');
};

const callOpenAI = async (messages) => {
  const apiKey = process.env.OPENAI_API_KEY || '';
  if (!isValidApiKey(apiKey)) throw new Error('OpenAI key is missing.');

  const client = new OpenAI({ apiKey, timeout: 20000 });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages,
    temperature: 0.7,
    max_tokens: 900,
  });

  const answer = response.choices[0]?.message?.content?.trim();
  if (!answer) throw new Error('OpenAI returned an empty response.');
  return answer;
};

const callGemini = async (history, question) => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!isValidApiKey(apiKey)) throw new Error('Gemini key is missing.');

  const ai = new GoogleGenAI({ apiKey });
  const { systemInstruction, contents } = buildGeminiContents(history, question);
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    systemInstruction,
    contents,
  });

  const answer = typeof response?.text === 'string' ? response.text.trim() : '';
  if (!answer) throw new Error('Gemini returned an empty response.');
  return answer;
};

router.post('/ask', uploadMiddleware, async (req, res, next) => {
  try {
    const question = String(req.body.question || '').trim();
    const bodyAttachments = normalizeAttachmentList(req.body.attachments);
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const rawAttachments = [...bodyAttachments, ...uploadedFiles];
    const extractedPdfText = await collectUploadedText(rawAttachments);
    const history = normalizeMessageHistory(req.body.messages).slice(-10).filter((item) => ['user', 'assistant'].includes(item?.role) && typeof item?.content === 'string' && item.content.length <= 4000).map((item) => ({ role: item.role, content: item.content }));

    const attachmentInstruction = extractedPdfText
      ? 'The user uploaded a document. Review its content directly and do not ask them to paste it. If it is a CV, assess role fit, strengths, gaps, measurable achievements, and give specific interview improvements.'
      : '';
    const contextQuestion = [
      attachmentInstruction,
      question,
      extractedPdfText ? `\n\nUploaded document content:\n${extractedPdfText.slice(0, 12000)}` : '',
    ].filter(Boolean).join('\n');

    if (!contextQuestion || contextQuestion.length > 16000) return res.status(400).json({ success: false, message: 'Your question and document content are too large. Please upload a shorter document.' });

    const messages = [{ role: 'system', content: 'You are InterviewIQ, a helpful general-purpose AI assistant. Answer any safe question clearly, accurately, and in the user\'s language when possible. Adapt the depth and format to the question. For technical topics, explain concepts and include concise examples when useful. For current or uncertain facts, be transparent about limitations and never invent sources or claims. You may also help with interview preparation, coding, writing, learning, planning, and everyday questions.' }, ...history, { role: 'user', content: contextQuestion }];

    const openAiKey = process.env.OPENAI_API_KEY || '';
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const localFallbackEnabled = process.env.ALLOW_LOCAL_FALLBACK === 'true';

    if (isValidApiKey(openAiKey)) {
      const answer = await callOpenAI(messages);
      return res.json({ success: true, data: { answer, source: 'openai' } });
    }

    if (isValidApiKey(geminiKey)) {
      const answer = await callGemini(history, contextQuestion);
      return res.json({ success: true, data: { answer, source: 'gemini' } });
    }

    if (localFallbackEnabled) {
      return res.json({ success: true, data: { answer: fallback(question), source: 'local-fallback' } });
    }

    return res.status(503).json({
      success: false,
      message: 'No valid AI provider key is configured. Add OPENAI_API_KEY or GEMINI_API_KEY in backend/.env and restart the backend.'
    });
  } catch (error) {
    const message = error?.message || 'The AI service failed unexpectedly.';
    return res.status(502).json({ success: false, message: `AI request failed: ${message}` });
  }
});

export default router;
