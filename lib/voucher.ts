import { randomBytes } from 'crypto';

export function generateVoucherCode(): string {
  // Generate a short, unique code like "OHH-AB12CD"
  const random = randomBytes(3).toString('hex').toUpperCase();
  return `OHH-${random}`;
}

export function generateQRData(code: string): string {
  // QR data should contain the voucher code for scanning
  // In production, you might want to include additional metadata
  return JSON.stringify({
    code,
    type: 'voucher',
    version: '1.0'
  });
}

export function parseQRData(qrData: string): { code: string } | null {
  try {
    const data = JSON.parse(qrData);
    if (data.type === 'voucher' && data.code) {
      return { code: data.code };
    }
    return null;
  } catch {
    // If JSON parsing fails, treat as plain code
    return { code: qrData };
  }
}

export function calculateVoucherExpiry(dealType: 'HAPPY_HOUR' | 'INSTANT'): Date {
  const now = new Date();
  
  if (dealType === 'INSTANT') {
    // Instant deals expire in 2 hours
    return new Date(now.getTime() + 2 * 60 * 60 * 1000);
  } else {
    // Happy hour deals expire at the end of the current time window
    // For now, default to 4 hours
    return new Date(now.getTime() + 4 * 60 * 60 * 1000);
  }
}
