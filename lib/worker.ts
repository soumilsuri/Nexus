import { db } from './db';
import { jobs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { updateJobStatus } from './jobs';

export async function processJob(jobId: string) {
  // Fetch job
  const jobResult = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (jobResult.length === 0) return;
  const job = jobResult[0];

  // We only process pending or specifically re-queued (failed but retrying) jobs
  // For now we process pending. We'll update this in the retry logic if needed.
  if (job.status !== 'pending' && job.status !== 'failed') return;

  const start = Date.now();
  await updateJobStatus(jobId, 'processing');

  try {
    // Simulate work based on type
    let delay = 500;
    if (job.type === 'compute') delay = 1500;
    if (job.type === 'network') delay = 1000;
    if (job.type === 'io') delay = 500;

    // Simulate 10% failure chance to test retries and DLQ
    if (Math.random() < 0.1) {
      throw new Error('Simulated transient failure');
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    const latencyMs = Date.now() - start;

    await updateJobStatus(jobId, 'completed', {
      completedAt: new Date(),
      latencyMs,
    });
  } catch (error: any) {
    // Basic failure state. Retries will be added in the next step.
    await updateJobStatus(jobId, 'failed', {
      errorMessage: error.message
    });
  }
}
