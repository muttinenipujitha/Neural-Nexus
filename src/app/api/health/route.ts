import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET() {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ status: 'unhealthy', db: 'N/A', llm: 'Missing API Key' }, { status: 503 });
    }

    const start = Date.now();
    await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'llama-3.1-8b-instant',
      max_tokens: 1
    });
    const latency = Date.now() - start;

    return NextResponse.json({ 
      status: 'healthy', 
      db: 'In-Memory (Client-Side State)', 
      llm: `Connected (${latency}ms)` 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy', 
      db: 'N/A', 
      llm: 'Connection Failed' 
    }, { status: 503 });
  }
}