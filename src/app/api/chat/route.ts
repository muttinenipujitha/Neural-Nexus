import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, documents } = await req.json();

    if (!question) return NextResponse.json({ error: 'No question provided' }, { status: 400 });
    if (!documents || documents.length === 0) {
      return NextResponse.json({ error: 'No documents in context' }, { status: 400 });
    }

    // 1. Flatten chunks
    let allChunks: { text: string; docName: string; docId: string }[] = [];
    documents.forEach((doc: any) => {
      doc.chunks.forEach((chunk: string) => {
        allChunks.push({ text: chunk, docName: doc.name, docId: doc.id });
      });
    });

    // Limit tokens for speed/cost
    const searchSpace = allChunks.slice(0, 50);

    // 2. AI Retrieval (Reranking)
    const chunksList = searchSpace.map((c, i) => 
      `Doc: ${c.docName}\nChunk ${i + 1}: ${c.text}`
    ).join("\n---\n");

    const selectionPrompt = `
      User Question: "${question}"
      Chunks:
      ${chunksList}
      Output the chunk number (1-${searchSpace.length}) that best answers the question. If none, output 0. Number only:
    `;

    let bestChunk = searchSpace[0]; // Fallback
    let sourceName = "Unknown";

    try {
      const selectionResponse = await groq.chat.completions.create({
        messages: [{ role: "user", content: selectionPrompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
        max_tokens: 5,
      });
      const choice = parseInt(selectionResponse.choices[0]?.message?.content || "0");
      if (choice > 0 && choice <= searchSpace.length) {
        bestChunk = searchSpace[choice - 1];
      }
    } catch (e) {
      console.error("Retrieval failed, using default", e);
    }

    sourceName = bestChunk.docName;

    // 3. Generation
    const answerPrompt = `
      Context: "${bestChunk.text}"
      Question: ${question}
      Answer strictly using the context. If not found, say "Answer not found in documents."
    `;

    const answerResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: answerPrompt }],
      model: "llama-3.1-8b-instant",
    });

    return NextResponse.json({ 
      answer: answerResponse.choices[0]?.message?.content || "No answer generated.", 
      source: sourceName, 
      snippet: bestChunk.text.substring(0, 200) + "..." 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}