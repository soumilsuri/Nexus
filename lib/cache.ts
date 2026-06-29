import { redis } from './redis';

const CACHE_TTL_SECONDS = 30;

export async function getCachedJob(id: string) {
  const cached = await redis.get(`job:${id}`);
  return cached ? (typeof cached === 'string' ? JSON.parse(cached) : cached) : null;
}

export async function setCachedJob(id: string, data: any) {
  await redis.setex(`job:${id}`, CACHE_TTL_SECONDS, JSON.stringify(data));
}

export async function invalidateCachedJob(id: string) {
  await redis.del(`job:${id}`);
}
