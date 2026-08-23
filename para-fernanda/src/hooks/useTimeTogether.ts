import { useEffect, useState } from "react";

export interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  valid: boolean;
}

/** Contador em tempo real desde `startDate` (AAAA-MM-DD ou ISO completo). */
export function useTimeTogether(startDate: string): TimeTogether {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const start = new Date(
    /T/.test(startDate) ? startDate : `${startDate}T00:00:00`
  ).getTime();

  if (Number.isNaN(start) || start > now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, valid: false };
  }

  const diff = Math.floor((now - start) / 1000);
  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    valid: true,
  };
}
