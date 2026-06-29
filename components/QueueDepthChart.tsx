'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

export default function QueueDepthChart() {
  const [data, setData] = useState<any[]>([
    { name: 'Critical', depth: 0, fill: '#ef4444' },
    { name: 'Normal', depth: 0, fill: '#3b82f6' },
    { name: 'Low', depth: 0, fill: '#10b981' },
  ]);

  useEffect(() => {
    const eventSource = new EventSource('/api/metrics/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.snapshot) {
          const { queueDepthCritical, queueDepthNormal, queueDepthLow } = parsed.snapshot;
          setData([
            { name: 'Critical', depth: queueDepthCritical, fill: '#ef4444' },
            { name: 'Normal', depth: queueDepthNormal, fill: '#3b82f6' },
            { name: 'Low', depth: queueDepthLow, fill: '#10b981' },
          ]);
        }
      } catch (e) {
        console.error('Failed to parse SSE data', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm col-span-1">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-medium text-white">Live Queue Depth</h2>
      </div>
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis dataKey="name" stroke="#a3a3a3" tickLine={false} axisLine={false} />
            <YAxis stroke="#a3a3a3" tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: '#262626' }}
              contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
            />
            <Bar dataKey="depth" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
