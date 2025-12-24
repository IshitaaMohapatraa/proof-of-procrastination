import { useMemo } from "react";
import { useProcrastinationChain } from "./useProcrastinationChain";

export function useAnalytics() {
  const { chain, isLoading } = useProcrastinationChain();

  const analytics = useMemo(() => {
    if (chain.length === 0) {
      return {
        totalMinutes: 0,
        totalSessions: 0,
        averageSessionMinutes: 0,
        longestSession: 0,
        mostCommonActivity: null,
        peakHour: null,
        weeklyData: [],
        activityBreakdown: [],
      };
    }

    // Total time
    const totalMinutes = chain.reduce((sum, b) => sum + b.duration_minutes, 0);
    const totalSessions = chain.length;
    const averageSessionMinutes = Math.round(totalMinutes / totalSessions);
    const longestSession = Math.max(...chain.map((b) => b.duration_minutes));

    // Activity breakdown
    const activityCounts: Record<string, number> = {};
    chain.forEach((b) => {
      activityCounts[b.activity_type] = (activityCounts[b.activity_type] || 0) + b.duration_minutes;
    });

    const totalActivityMinutes = Object.values(activityCounts).reduce((a, b) => a + b, 0);
    const activityBreakdown = Object.entries(activityCounts)
      .map(([activity, minutes]) => ({
        activity,
        minutes,
        percentage: Math.round((minutes / totalActivityMinutes) * 100),
      }))
      .sort((a, b) => b.minutes - a.minutes);

    const mostCommonActivity = activityBreakdown[0]?.activity || null;

    // Peak hour
    const hourCounts: Record<number, number> = {};
    chain.forEach((b) => {
      const hour = new Date(b.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

    // Weekly data (last 7 days)
    const today = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];

      const dayMinutes = chain
        .filter((b) => b.timestamp.startsWith(dateStr))
        .reduce((sum, b) => sum + b.duration_minutes, 0);

      return {
        day: dayStr,
        hours: Math.round((dayMinutes / 60) * 10) / 10,
        minutes: dayMinutes,
      };
    });

    return {
      totalMinutes,
      totalSessions,
      averageSessionMinutes,
      longestSession,
      mostCommonActivity,
      peakHour: peakHour ? parseInt(peakHour) : null,
      weeklyData,
      activityBreakdown,
    };
  }, [chain]);

  return {
    ...analytics,
    isLoading,
    hasData: chain.length > 0,
  };
}
