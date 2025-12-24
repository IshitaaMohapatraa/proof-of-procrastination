import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { generateBlockHash, validateChain } from "@/lib/hash";
import { useCallback, useMemo } from "react";

export interface ProcrastinationBlock {
  id: string;
  user_id: string;
  block_index: number;
  timestamp: string;
  activity_type: string;
  custom_label: string | null;
  duration_minutes: number;
  mood: string;
  excuse: string;
  prev_hash: string;
  current_hash: string;
  created_at: string;
}

export function useProcrastinationChain() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch entire chain for current user - with aggressive caching
  const chainQuery = useQuery({
    queryKey: ["procrastination-chain", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("procrastination_chain")
        .select("*")
        .eq("user_id", user.id)
        .order("block_index", { ascending: true });

      if (error) throw error;
      return data as ProcrastinationBlock[];
    },
    enabled: !!user,
    // CRITICAL: Prevent refetching on navigation
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache retention
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Add new block to chain - hash computation ONLY happens here
  const addBlockMutation = useMutation({
    mutationFn: async (blockData: {
      activity_type: string;
      custom_label?: string | null;
      duration_minutes: number;
      mood: string;
      excuse: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Get the latest block to determine prev_hash and block_index
      const { data: latestBlock, error: fetchError } = await supabase
        .from("procrastination_chain")
        .select("*")
        .eq("user_id", user.id)
        .order("block_index", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const block_index = latestBlock ? latestBlock.block_index + 1 : 1;
      const prev_hash = latestBlock ? latestBlock.current_hash : "GENESIS";
      const timestamp = new Date().toISOString();

      // Generate hash - ONLY when adding a new block
      const current_hash = await generateBlockHash({
        block_index,
        timestamp,
        activity_type: blockData.activity_type,
        custom_label: blockData.custom_label || null,
        duration_minutes: blockData.duration_minutes,
        mood: blockData.mood,
        excuse: blockData.excuse,
        prev_hash,
      });

      // Insert the block
      const { data, error } = await supabase
        .from("procrastination_chain")
        .insert({
          user_id: user.id,
          block_index,
          timestamp,
          activity_type: blockData.activity_type,
          custom_label: blockData.custom_label || null,
          duration_minutes: blockData.duration_minutes,
          mood: blockData.mood,
          excuse: blockData.excuse,
          prev_hash,
          current_hash,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ProcrastinationBlock;
    },
    onSuccess: () => {
      // Only invalidate on explicit add - not on navigation
      queryClient.invalidateQueries({ queryKey: ["procrastination-chain", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["analytics", user?.id] });
    },
  });

  // Memoized chain data
  const chain = useMemo(() => chainQuery.data || [], [chainQuery.data]);

  // Validate chain integrity - memoized callback
  const validateChainIntegrity = useCallback(async () => {
    if (chain.length === 0) return { valid: true, broken_at: null };
    return validateChain(chain);
  }, [chain]);

  return {
    chain,
    isLoading: chainQuery.isLoading,
    error: chainQuery.error,
    addBlock: addBlockMutation.mutateAsync,
    isAddingBlock: addBlockMutation.isPending,
    validateChainIntegrity,
    refetch: chainQuery.refetch,
  };
}
