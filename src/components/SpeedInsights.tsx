import { useEffect } from 'react';
import { injectSpeedInsights } from '@vercel/speed-insights';

/**
 * Speed Insights Component
 * 
 * Integrates Vercel Speed Insights into the application.
 * This component injects the Speed Insights tracking script on mount.
 * 
 * Speed Insights helps monitor and analyze Web Vitals and other performance metrics.
 * Data is collected and available in the Vercel dashboard.
 */
export function SpeedInsights() {
  useEffect(() => {
    // Inject Speed Insights tracking script
    injectSpeedInsights();
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default SpeedInsights;
