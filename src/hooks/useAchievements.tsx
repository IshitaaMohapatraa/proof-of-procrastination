import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useProcrastinationChain } from "./useProcrastinationChain";
import { useEffect, useMemo, useCallback, useRef } from "react";

export interface Achievement {
  id: string;
  user_id: string;
  badge_code: string;
  unlocked_at: string;
}

export interface AchievementDefinition {
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic" | "Secret";
  check: (stats: ChainStats) => boolean;
}

interface ChainStats {
  totalSessions: number;
  totalMinutes: number;
  longestSession: number;
  chainLength: number;
  activityCounts: Record<string, number>;
}

const achievementDefinitions: AchievementDefinition[] = [
  { 
    code: "first_delay", 
    name: "First Delay", 
    description: "Log your first procrastination", 
    icon: "🐌", 
    rarity: "Common",
    check: (stats) => stats.totalSessions >= 1,
  },
  { 
    code: "hour_waster", 
    name: "Hour Waster", 
    description: "Waste a full hour in one session", 
    icon: "⏰", 
    rarity: "Common",
    check: (stats) => stats.longestSession >= 60,
  },
  { 
    code: "serial_snoozer", 
    name: "Serial Snoozer", 
    description: "Log 5 procrastination sessions", 
    icon: "😴", 
    rarity: "Uncommon",
    check: (stats) => stats.totalSessions >= 5,
  },
  { 
    code: "excuse_expert", 
    name: "Excuse Expert", 
    description: "Log 10 procrastination sessions", 
    icon: "🎭", 
    rarity: "Uncommon",
    check: (stats) => stats.totalSessions >= 10,
  },
  { 
    code: "chain_champion", 
    name: "Chain Champion", 
    description: "Build a 25-block chain", 
    icon: "⛓️", 
    rarity: "Rare",
    check: (stats) => stats.chainLength >= 25,
  },
  { 
    code: "deadline_dancer", 
    name: "Deadline Dancer", 
    description: "Waste 5 hours total", 
    icon: "💃", 
    rarity: "Rare",
    check: (stats) => stats.totalMinutes >= 300,
  },
  { 
    code: "week_wrecker", 
    name: "Week Wrecker", 
    description: "Waste 10 hours total", 
    icon: "📅", 
    rarity: "Epic",
    check: (stats) => stats.totalMinutes >= 600,
  },
  { 
    code: "night_owl", 
    name: "Night Owl", 
    description: "Log 20 procrastination sessions", 
    icon: "🦉", 
    rarity: "Epic",
    check: (stats) => stats.totalSessions >= 20,
  },
  { 
    code: "hash_master", 
    name: "Hash Master", 
    description: "Build a 50-block chain", 
    icon: "🔐", 
    rarity: "Legendary",
    check: (stats) => stats.chainLength >= 50,
  },
  { 
    code: "professional_procrastinator", 
    name: "Professional Procrastinator", 
    description: "Waste 24 hours total", 
    icon: "👑", 
    rarity: "Legendary",
    check: (stats) => stats.totalMinutes >= 1440,
  },
  { 
    code: "chaos_agent", 
    name: "Chaos Agent", 
    description: "Build a 100-block chain", 
    icon: "🔥", 
    rarity: "Mythic",
    check: (stats) => stats.chainLength >= 100,
  },
  { 
    code: "mystery", 
    name: "????", 
    description: "???", 
    icon: "❓", 
    rarity: "Secret",
    check: () => false,
  },
];

export function useAchievements() {
  const { user } = useAuth();
  const { chain } = useProcrastinationChain();
  const queryClient = useQueryClient();
  const lastCheckedLength = useRef(0);

  // Fetch user's unlocked achievements
  const achievementsQuery = useQuery({
    queryKey: ["achievements", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as Achievement[];
    },
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Unlock achievement mutation
  const unlockMutation = useMutation({
    mutationFn: async (badge_code: string) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("achievements")
        .insert({
          user_id: user.id,
          badge_code,
        })
        .select()
        .single();

      if (error && error.code !== "23505") throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements", user?.id] });
    },
  });

  // Memoize chain stats calculation
  const chainStats: ChainStats = useMemo(() => ({
    totalSessions: chain.length,
    totalMinutes: chain.reduce((sum, block) => sum + block.duration_minutes, 0),
    longestSession: chain.length > 0 ? Math.max(...chain.map((b) => b.duration_minutes)) : 0,
    chainLength: chain.length,
    activityCounts: chain.reduce((acc, block) => {
      acc[block.activity_type] = (acc[block.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  }), [chain]);

  // Memoize unlock achievement callback
  const unlockAchievement = useCallback(
    (code: string) => unlockMutation.mutateAsync(code),
    [unlockMutation]
  );

  // Check and unlock new achievements - only when chain length changes
  useEffect(() => {
    if (!user || !achievementsQuery.data || chain.length === lastCheckedLength.current) return;
    lastCheckedLength.current = chain.length;

    const unlockedCodes = new Set(achievementsQuery.data.map((a) => a.badge_code));

    achievementDefinitions.forEach((def) => {
      if (!unlockedCodes.has(def.code) && def.check(chainStats)) {
        unlockMutation.mutate(def.code);
      }
    });
  }, [chain.length, user, achievementsQuery.data, chainStats, unlockMutation]);

  // Memoize all achievements with unlock status
  const allAchievements = useMemo(() => 
    achievementDefinitions.map((def) => ({
      ...def,
      unlocked: achievementsQuery.data?.some((a) => a.badge_code === def.code) || false,
      unlockedAt: achievementsQuery.data?.find((a) => a.badge_code === def.code)?.unlocked_at,
    })),
    [achievementsQuery.data]
  );

  return {
    achievements: allAchievements,
    unlockedAchievements: achievementsQuery.data || [],
    isLoading: achievementsQuery.isLoading,
    chainStats,
    unlockAchievement,
  };
}
