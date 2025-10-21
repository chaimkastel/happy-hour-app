'use client';

let serverTimeDelta: number | null = null;
let lastSyncTime: number | null = null;
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export async function syncServerTime(): Promise<number> {
  try {
    const response = await fetch('/api/time');
    const data = await response.json();
    
    const clientTime = Date.now();
    serverTimeDelta = data.serverTime - clientTime;
    lastSyncTime = clientTime;
    
    return serverTimeDelta;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to sync server time:', error);
    }
    return 0;
  }
}

export function getServerTime(): number {
  if (serverTimeDelta === null || lastSyncTime === null) {
    return Date.now();
  }
  
  // Re-sync if it's been too long
  const timeSinceLastSync = Date.now() - lastSyncTime;
  if (timeSinceLastSync > SYNC_INTERVAL) {
    syncServerTime(); // Fire and forget
  }
  
  return Date.now() + serverTimeDelta;
}

export function getTimeUntil(targetTime: number): number {
  const serverTime = getServerTime();
  return Math.max(0, targetTime - serverTime);
}

export function isTimeInWindow(startTime: number, endTime: number): boolean {
  const serverTime = getServerTime();
  return serverTime >= startTime && serverTime <= endTime;
}

export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return 'Expired';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

