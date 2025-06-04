// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic');

  if (!topic) {
    return NextResponse.json({ error: 'Missing "topic" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not found in env' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const internalKeywords = 'concepts, subtopics, real-world examples, edge cases, best practices, misconceptions, diagrams (describe them), comparisons with similar topics';

  const prompt = `
Generate a comprehensive study note on the topic: "${topic}". 
It must include:
- All key subtopics and in-depth explanations
- Code or real-world examples
- Edge cases and common misconceptions
- Comparison with similar concepts
- Use of technical terminology
- Educational tone (as if teaching a beginner to intermediate learner)
- Include these keywords as guidance: ${internalKeywords}
Format the output in markdown or structured text.
`;

  try {
    const result = await model.generateContent(prompt);
    const notes = result.response.text();
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('[Gemini Error]', error);
    return NextResponse.json({ error: 'Failed to generate notes' }, { status: 500 });
  }
}
