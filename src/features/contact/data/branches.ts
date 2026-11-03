export interface Branch {
  key: "riyadh" | "jeddah" | "medina" | "dammam" | "layla" | "abha";
  lat: number;
  lng: number;
}

// Placeholder locations until a branches endpoint exists; names live in messages under `branches`.
export const branches: Branch[] = [
  { key: "riyadh", lat: 24.9578, lng: 46.6989 },
  { key: "jeddah", lat: 21.6796, lng: 39.1565 },
  { key: "medina", lat: 24.5534, lng: 39.7051 },
  { key: "dammam", lat: 26.4712, lng: 49.7979 },
  { key: "layla", lat: 22.2809, lng: 46.7303 },
  { key: "abha", lat: 18.2401, lng: 42.6566 },
];
