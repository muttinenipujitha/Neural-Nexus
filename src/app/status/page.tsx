'use client';
import { useEffect, useState } from 'react';
import { Activity, Server, Cpu, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => { setStatus(data); setLoading(false); })
      .catch(() => { setStatus({ status: 'error' }); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="text-blue-600"/> System Status</h1>
        
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin"/> Checking systems...</div>
        ) : (
          <div className="grid gap-4">
            <StatusCard title="Overall Health" status={status?.status} />
            <StatusCard title="Database Strategy" status={status?.status === 'healthy' ? 'active' : 'inactive'} value={status?.db} />
            <StatusCard title="LLM Connection" status={status?.status === 'healthy' ? 'active' : 'inactive'} value={status?.llm} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ title, status, value }: any) {
  const isGood = status === 'healthy' || status === 'active';
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isGood ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isGood ? <CheckCircle /> : <XCircle />}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-lg font-bold text-slate-800">{value || (isGood ? "Operational" : "Failed")}</p>
        </div>
      </div>
    </div>
  );
}