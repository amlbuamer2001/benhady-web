"use client";
import dynamic from "next/dynamic";

/** Leaflet touches `window`, so the map only loads in the browser; a soft placeholder holds its space meanwhile. */
export const BranchesMapLazy = dynamic(() => import("./branches-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-primary-50" />,
});
