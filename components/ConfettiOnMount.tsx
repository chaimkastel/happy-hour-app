'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiOnMount() {
  useEffect(() => {
    // Trigger confetti when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return null; // This component doesn't render anything visible
}

