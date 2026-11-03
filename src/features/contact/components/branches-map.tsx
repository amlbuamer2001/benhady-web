"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Branch } from "../data/branches";

/** Logo pin that drops in (staggered) and hops on hover; styles live in globals.css (.branch-pin). */
const pinIcon = (index: number) =>
  L.divIcon({
    className: "",
    html: `<div class="branch-pin" style="animation-delay:${0.15 * index}s"><span class="branch-pin__head"><img src="/images/logo.svg" alt="" /></span></div>`,
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -50],
  });

interface Props {
  branches: (Branch & { name: string })[];
  label: string;
}

/** Leaflet map of the branches (browser-only; loaded through BranchesMapLazy). */
export default function BranchesMap({ branches, label }: Props) {
  // On touch screens one finger should scroll the page, not pan the map.
  const touch = L.Browser.mobile;
  return (
    <MapContainer
      center={[23.4, 44.2]}
      zoom={touch ? 5 : 6}
      scrollWheelZoom={false}
      dragging={!touch}
      attributionControl
      className="size-full"
      aria-label={label}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {branches.map((b, i) => (
        <Marker key={b.key} position={[b.lat, b.lng]} icon={pinIcon(i)} title={b.name}>
          <Popup>
            <span className="font-sans text-sm font-bold">{b.name}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
