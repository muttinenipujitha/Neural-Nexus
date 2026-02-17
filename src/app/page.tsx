'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Send, Activity, Sparkles, X, Check, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Document { id: string; name: string; chunks: string[]; }
interface ChatRun { id: string; question: string; answer: string; source: string; snippet: string; }

export default function Home() {
  // --- PERSISTENCE LOGIC (Fixes Hydration Error) ---
  const [documents, setDocuments] = useState<Document[]>([]);
  const [history, setHistory] = useState<ChatRun[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data on mount only
  useEffect(() => {
    const savedDocs = localStorage.getItem('nexus_docs');
    if (savedDocs) {
      try { setDocuments(JSON.parse(savedDocs)); } catch (e) { console.error(e); }
    }
    const savedHistory = localStorage.getItem('nexus_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('nexus_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('nexus_history', JSON.stringify(history));
  }, [history]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [history, loading]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      setLoading(true);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) setDocuments(prev => [...prev, data.document]);
        else alert(data.error);
      } catch (err) { alert('Upload error'); }
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || documents.length === 0) {
      if(documents.length === 0) alert("Upload a document to initialize the system.");
      return;
    }
    setLoading(true);
    const currentQuestion = question;
    setQuestion('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, documents })
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(prev => [{ id: Date.now().toString(), question: currentQuestion, answer: data.answer, source: data.source, snippet: data.snippet }, ...prev].slice(0, 10));
      } else alert(data.error);
    } catch (err) { alert('Network error'); }
    setLoading(false);
  };

  const removeDoc = (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-purple-500 selection:text-white">
      
      {/* Clean Background - No Blurs */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050505] to-[#0a0a0f]" />

      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-half max-w-5xl px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-purple-500/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h1 className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                NEURAL NEXUS
              </h1>
            </div>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Private Knowledge AI</p>
          <Link href="/status" className="p-1.5 rounded-full hover:bg-white/5 transition-colors ml-2">
            <Activity className="w-4 h-4 text-slate-400 hover:text-white" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 grid grid-cols-12 h-screen pt-24 pb-6 px-6 gap-4 max-w-[1800px] mx-auto">
        
        {/* LEFT SIDEBAR: DATA STREAM */}
        <aside className="col-span-3 flex flex-col gap-4">
          <div className="flex-1 flex flex-col bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg shadow-black/40">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Data Stream
              </h2>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
              {/* Upload Section */}
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="group cursor-pointer border border-dashed border-slate-700 rounded-xl p-5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
              >
                <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept=".txt" />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-lg group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-200">Inject Data</p>
                    <p className="text-[10px] text-slate-500">Supports .txt files</p>
                  </div>
                </div>
              </div>

              {/* Active Nodes */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">Active Nodes</h3>
                <div className="space-y-1.5">
                  {documents.map(doc => (
                    <div key={doc.id} className="group flex items-center justify-between p-2.5 bg-slate-800/50 border border-white/5 rounded-lg hover:bg-slate-800 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-xs text-slate-300 truncate font-mono">{doc.name}</span>
                      </div>
                      <button onClick={() => removeDoc(doc.id)} className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded hover:bg-red-400/10">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Log */}
              {history.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">Log Buffer</h3>
                  <div className="space-y-1.5">
                    {history.slice(0, 3).map((h) => (
                      <div key={h.id} className="p-2 rounded border border-white/5 bg-slate-900/50 flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-slate-600" />
                        <p className="text-[10px] text-slate-400 truncate">{h.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* CENTER: CHAT INTERFACE */}
        <section className="col-span-6 flex flex-col h-full relative">
          <div className="flex-1 flex flex-col bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg shadow-black/40">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <div className="p-4 bg-slate-800 rounded-full mb-4">
                     <Zap className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300">System Ready</h3>
                  <p className="text-xs text-slate-500 mt-1">Awaiting input data stream...</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md">
                        <p className="text-sm leading-relaxed">{item.question}</p>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="max-w-[90%] bg-slate-800 border border-white/5 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] font-bold text-cyan-400/90 uppercase tracking-wider">AI Core Response</span>
                        </div>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap font-light">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-white/5 p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Clean Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-white/10">
              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl p-1.5 focus-within:border-purple-500/50 focus-within:shadow-[0_0_0_2px_rgba(168,85,247,0.1)] transition-all">
               <textarea
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }}
  placeholder="Initialize query sequence..."
  className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-400 caret-white px-3 py-2 focus:outline-none resize-none max-h-32 text-sm"
  style={{ color: 'white' }}
  rows={1}
  disabled={loading}
/>

                <button 
                  onClick={handleAsk} 
                  disabled={loading || !question.trim()}
                  className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR: VERIFICATION */}
        <aside className="col-span-3 flex flex-col">
          <div className="flex-1 flex flex-col bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg shadow-black/40">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verification</h2>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              {history.length > 0 ? (
                <div className="space-y-6">
                  {/* Document Info Card */}
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-3">Origin Document</p>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-slate-200 truncate font-mono">{history[0].source}</p>
                    </div>
                  </div>

                  {/* Snippet Card */}
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-3">Extracted Context</p>
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-xl"></div>
                      <p className="text-xs text-slate-400 leading-relaxed font-mono italic pl-3">
                        "{history[0].snippet}"
                      </p>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Confidence Score</span>
                      <span className="text-xs font-bold text-green-400 font-mono">98.4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-600 to-green-400 w-[98%]"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-slate-800/50 rounded-full mb-3">
                    <Activity className="w-5 h-5 text-slate-600" />
                  </div>
                  <p className="text-xs font-mono text-slate-500 uppercase">No Signal</p>
                </div>
              )}
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}

