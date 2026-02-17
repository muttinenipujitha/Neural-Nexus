import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (file.type !== "text/plain") return NextResponse.json({ error: 'Only .txt files supported' }, { status: 400 });

    const text = await file.text();
    
    // Chunking Strategy: Split by double newlines, cap at 1000 chars
    const rawChunks = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = "";
    
    rawChunks.forEach((part) => {
      if ((currentChunk.length + part.length) > 1000) {
        if(currentChunk) chunks.push(currentChunk);
        currentChunk = part;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + part;
      }
    });
    if (currentChunk) chunks.push(currentChunk);

    const newDoc = {
      id: crypto.randomUUID(),
      name: file.name,
      chunks: chunks,
      timestamp: new Date()
    };

    return NextResponse.json({ document: newDoc });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}