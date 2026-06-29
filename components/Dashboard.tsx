'use client';

import QueueDepthChart from './QueueDepthChart';
import ThroughputChart from './ThroughputChart';
import LatencyChart from './LatencyChart';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QueueDepthChart />
      <ThroughputChart />
      <LatencyChart />
    </div>
  );
}
