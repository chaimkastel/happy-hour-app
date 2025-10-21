import { z } from 'zod';

const TimeWindowSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

const DealTimeConfigSchema = z.object({
  daysOfWeek: z.array(z.string()),
  timeWindows: z.array(TimeWindowSchema),
  timezone: z.string(),
});

export type DealTimeConfig = z.infer<typeof DealTimeConfigSchema>;
export type TimeWindow = z.infer<typeof TimeWindowSchema>;

export function isDealCurrentlyActive(
  dealConfig: DealTimeConfig,
  currentTime: Date = new Date()
): boolean {
  try {
    const config = DealTimeConfigSchema.parse(dealConfig);
    
    // Convert current time to venue timezone
    const venueTime = new Date(currentTime.toLocaleString("en-US", { 
      timeZone: config.timezone 
    }));
    
    const currentDay = venueTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTimeStr = venueTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Check if current day is in allowed days
    if (!config.daysOfWeek.includes(currentDay)) {
      return false;
    }
    
    // Check if current time is within any time window
    return config.timeWindows.some(window => 
      isTimeInWindow(currentTimeStr, window.start, window.end)
    );
  } catch (error) {
    console.error('Invalid deal time configuration:', error);
    return false;
  }
}

function isTimeInWindow(currentTime: string, startTime: string, endTime: string): boolean {
  const current = timeToMinutes(currentTime);
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  if (start <= end) {
    // Same day window (e.g., 15:00 to 18:00)
    return current >= start && current <= end;
  } else {
    // Overnight window (e.g., 22:00 to 02:00)
    return current >= start || current <= end;
  }
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getNextActiveWindow(dealConfig: DealTimeConfig): Date | null {
  try {
    const config = DealTimeConfigSchema.parse(dealConfig);
    const now = new Date();
    
    // Check next 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      
      const venueTime = new Date(checkDate.toLocaleString("en-US", { 
        timeZone: config.timezone 
      }));
      
      const dayName = venueTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (config.daysOfWeek.includes(dayName)) {
        // Find the earliest time window for this day
        const sortedWindows = config.timeWindows.sort((a, b) => 
          timeToMinutes(a.start) - timeToMinutes(b.start)
        );
        
        for (const window of sortedWindows) {
          const windowStart = new Date(venueTime);
          const [hours, minutes] = window.start.split(':').map(Number);
          windowStart.setHours(hours, minutes, 0, 0);
          
          // If this is today and the window hasn't started yet, or it's a future day
          if (i === 0) {
            const currentTime = new Date(venueTime);
            if (windowStart > currentTime) {
              return windowStart;
            }
          } else {
            return windowStart;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating next active window:', error);
    return null;
  }
}

export function formatTimeWindow(window: TimeWindow): string {
  const start = formatTime(window.start);
  const end = formatTime(window.end);
  return `${start} - ${end}`;
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}
