"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import type { KillEvent, KillRange } from "@/lib/api/types";

export function useKillHistory(
  serverId: string | undefined,
  archimonsterId: string | undefined,
  range: KillRange
) {
  return useQuery({
    queryKey: ["kills", serverId, archimonsterId, range],
    queryFn: () =>
      apiGet<KillEvent[]>(
        `/api/proxy/servers/${serverId}/archimonsters/${archimonsterId}/kills?range=${range}`
      ),
    enabled: Boolean(serverId) && Boolean(archimonsterId),
  });
}
