// SHA-256 hash generation for procrastination chain blocks
export async function generateBlockHash(data: {
  block_index: number;
  timestamp: string;
  activity_type: string;
  custom_label: string | null;
  duration_minutes: number;
  mood: string;
  excuse: string;
  prev_hash: string;
}): Promise<string> {
  const payload = [
    data.block_index,
    data.timestamp,
    data.activity_type,
    data.custom_label || "",
    data.duration_minutes,
    data.mood,
    data.excuse,
    data.prev_hash,
  ].join("|");

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}

// Validate chain integrity by recomputing hashes
export async function validateChain(blocks: Array<{
  block_index: number;
  timestamp: string;
  activity_type: string;
  custom_label: string | null;
  duration_minutes: number;
  mood: string;
  excuse: string;
  prev_hash: string;
  current_hash: string;
}>): Promise<{ valid: boolean; broken_at: number | null }> {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const computedHash = await generateBlockHash({
      block_index: block.block_index,
      timestamp: block.timestamp,
      activity_type: block.activity_type,
      custom_label: block.custom_label,
      duration_minutes: block.duration_minutes,
      mood: block.mood,
      excuse: block.excuse,
      prev_hash: block.prev_hash,
    });

    if (computedHash !== block.current_hash) {
      return { valid: false, broken_at: block.block_index };
    }

    // For non-genesis blocks, check prev_hash matches previous block's current_hash
    if (i > 0 && block.prev_hash !== blocks[i - 1].current_hash) {
      return { valid: false, broken_at: block.block_index };
    }
  }

  return { valid: true, broken_at: null };
}
