"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import type { PriceEvent, PriceRange } from "@/lib/api/types";

export function usePriceHistory(
  serverId: string | undefined,
  archimonsterId: string | undefined,
  range: PriceRange
) {
  return useQuery({
    queryKey: ["prices", serverId, archimonsterId, range],
    queryFn: () =>
      apiGet<PriceEvent[]>(
        `/api/proxy/servers/${serverId}/archimonsters/${archimonsterId}/prices?range=${range}`
      ),
    enabled: Boolean(serverId) && Boolean(archimonsterId),
  });
}
