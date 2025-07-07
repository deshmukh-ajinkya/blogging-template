import { useReportWebVitals } from 'next/web-vitals';

export const MeasurePerformance = (): void =>
  useReportWebVitals((metric) => {
    console.log(metric);
  });
