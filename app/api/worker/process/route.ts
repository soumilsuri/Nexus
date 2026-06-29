import { NextResponse } from 'next/server';
import { dequeueJobs } from '@/lib/queue';
import { processJob } from '@/lib/worker';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max duration for Vercel Hobby is usually 10s, but setting to 60 for Pro if applicable

export async function POST(request: Request) {
  // Simple auth could be added here for Vercel Cron, usually by checking an authorization header
  try {
    const batchSize = 10;
    const jobIds = await dequeueJobs(batchSize);
    
    if (jobIds.length === 0) {
      return NextResponse.json({ message: 'No jobs in queue' }, { status: 200 });
    }

    // Process all jobs in parallel
    await Promise.allSettled(jobIds.map(id => processJob(id)));
    
    return NextResponse.json({ processed: jobIds.length, jobIds }, { status: 200 });
  } catch (error) {
    console.error('Worker tick error:', error);
    return NextResponse.json({ error: 'Worker execution failed' }, { status: 500 });
  }
}
