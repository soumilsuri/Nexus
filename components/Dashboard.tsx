'use client';

import QueueDepthChart from './QueueDepthChart';
import ThroughputChart from './ThroughputChart';
import LatencyChart from './LatencyChart';
import JobTable from './JobTable';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QueueDepthChart />
      <QueueDepthChart />
      <ThroughputChart />
      <LatencyChart />
      <JobTable />
    </div>
  );
}
