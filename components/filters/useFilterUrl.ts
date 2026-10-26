"use client";

// Mounts the FilterState reducer and syncs it to the URL via useSearchParams
// + router.replace. Keeps React/Next imports out of lib/filters.ts so the
// pure engine stays SSR-safe and jsdom-free in tests.
import { useReducer, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { FilterState, PriceBand } from "@/lib/filters";
import type { CategorySlug, Possession } from "@/lib/types";

type Action =
  | { type: "setPriceBand"; band: PriceBand | null }
  | { type: "toggleBhk"; value: 1 | 2 | 3 | 4 | 5 }
  | { type: "togglePossession"; value: Possession }
  | { type: "setPlotSubtype"; value: FilterState["plotSubtype"] }
  | { type: "reset" };

const PRICE_BANDS: PriceBand[] = ["20-50L", "50L-1Cr", "1Cr+"];
const POSSESSIONS: Possession[] = ["ready", "under-construction", "upcoming"];
const PLOT_SUBTYPES: FilterState["plotSubtype"][] = ["all", "plotted-development", "standalone"];

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case "setPriceBand":
      return { ...state, priceBand: action.band };
    case "toggleBhk":
      return { ...state, bhk: toggle(state.bhk, action.value) };
    case "togglePossession":
      return { ...state, possession: toggle(state.possession, action.value) };
    case "setPlotSubtype":
      return { ...state, plotSubtype: action.value };
    case "reset":
      return { ...state, priceBand: null, bhk: [], possession: [], plotSubtype: "all" };
  }
}

function parseFromParams(params: URLSearchParams, category: CategorySlug): FilterState {
  const rawBand = params.get("price");
  const priceBand = PRICE_BANDS.includes(rawBand as PriceBand) ? (rawBand as PriceBand) : null;

  const bhk = (params.get("bhk") ?? "")
    .split(",")
    .map((s) => Number(s))
    .filter((n): n is 1 | 2 | 3 | 4 | 5 => [1, 2, 3, 4, 5].includes(n));

  const possession = (params.get("possession") ?? "")
    .split(",")
    .filter((s): s is Possession => POSSESSIONS.includes(s as Possession));

  const rawSub = params.get("sub");
  const plotSubtype = PLOT_SUBTYPES.includes(rawSub as FilterState["plotSubtype"])
    ? (rawSub as FilterState["plotSubtype"])
    : "all";

  return { category, priceBand, bhk, possession, plotSubtype };
}

function toParams(state: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (state.priceBand) p.set("price", state.priceBand);
  if (state.bhk.length) p.set("bhk", [...state.bhk].sort().join(","));
  if (state.possession.length) p.set("possession", state.possession.join(","));
  if (state.plotSubtype !== "all") p.set("sub", state.plotSubtype);
  return p;
}

export function useFilterUrl(category: CategorySlug) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(
    () => parseFromParams(new URLSearchParams(searchParams.toString()), category),
    // Only parse the URL on first mount; subsequent updates flow state → URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const next = toParams(state).toString();
    const url = next ? `${pathname}?${next}` : pathname;
    router.replace(url, { scroll: false });
  }, [state, pathname, router]);

  return { state, dispatch } as const;
}
