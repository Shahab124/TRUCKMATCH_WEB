import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_CENTER, DEFAULT_ZOOM, cityLatLng } from "../../lib/cities";
import { formatWeight } from "../../lib/format";

// Truck pin drawn as inline SVG — no image assets, no broken default-icon paths.
const truckIcon = L.divIcon({
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `<div style="width:34px;height:34px;border-radius:9999px;background:#059669;
                     box-shadow:0 2px 10px rgba(2,44,34,.45);display:flex;align-items:center;
                     justify-content:center;border:2.5px solid #fff">
           <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
             <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
             <path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
             <circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
           </svg>
         </div>`,
});

const endpointIcon = (color) =>
  L.divIcon({
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    html: `<div style="width:12px;height:12px;border-radius:9999px;background:${color};
                       border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
  });

/**
 * Marker that glides to each new position instead of teleporting.
 * Leaflet owns the marker's DOM, so we animate its LatLng directly with rAF
 * rather than through Framer Motion (which can't drive a Leaflet marker).
 */
function AnimatedMarker({ position, children }) {
  const markerRef = useRef(null);
  const rafRef = useRef(null);
  const fromRef = useRef(position);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const from = fromRef.current;
    const to = position;
    if (!from || (from[0] === to[0] && from[1] === to[1])) {
      fromRef.current = to;
      return;
    }

    // rAF is paused in background tabs and pointless under reduced-motion —
    // jump straight to the true position so the marker is never stale.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.hidden) {
      marker.setLatLng(to);
      fromRef.current = to;
      return;
    }

    const start = performance.now();
    const DURATION = 950; // slightly under the 1s update tick, so motion is continuous

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      marker.setLatLng([
        from[0] + (to[0] - from[0]) * eased,
        from[1] + (to[1] - from[1]) * eased,
      ]);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [position]);

  return (
    <Marker ref={markerRef} position={fromRef.current ?? position} icon={truckIcon}>
      {children}
    </Marker>
  );
}

// Refit the view when the selected trip changes.
function FitRoute({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8 });
  }, [bounds, map]);
  return null;
}

export default function TripMap({ trips = [], positions = {}, selectedId, onSelect, className = "" }) {
  const [ready, setReady] = useState(false);
  const selected = trips.find((t) => t.id === selectedId) ?? null;

  const from = selected ? cityLatLng(selected.origin) : null;
  const to = selected ? cityLatLng(selected.destination) : null;
  const routeBounds = from && to ? [from, to] : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        whenReady={() => setReady(true)}
        className="h-full w-full z-0"
      >
        {/* Swap this one URL for Mapbox/Google later — nothing else changes. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routeBounds && (
          <>
            <Polyline positions={routeBounds} pathOptions={{ color: "#059669", weight: 3, opacity: 0.6, dashArray: "8 10" }} />
            <Marker position={from} icon={endpointIcon("#0f172a")}>
              <Popup>Origin — {selected.origin}</Popup>
            </Marker>
            <Marker position={to} icon={endpointIcon("#059669")}>
              <Popup>Destination — {selected.destination}</Popup>
            </Marker>
            <FitRoute bounds={routeBounds} />
          </>
        )}

        {trips.map((trip) => {
          const pos = positions[trip.id];
          if (!pos) return null;
          return (
            <AnimatedMarker key={trip.id} position={pos}>
              <Popup>
                <div className="min-w-[11rem]">
                  <p className="font-bold text-slate-900 mb-1">{trip.origin} → {trip.destination}</p>
                  <dl className="text-xs text-slate-600 space-y-0.5">
                    <div className="flex justify-between gap-3"><dt>Status</dt><dd className="font-semibold capitalize">{trip.status}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Capacity</dt><dd className="font-semibold">{formatWeight(trip.available_capacity)}</dd></div>
                    <div className="flex justify-between gap-3">
                      <dt>Last seen</dt>
                      <dd className="font-semibold">
                        {trip.last_updated ? new Date(trip.last_updated).toLocaleTimeString() : "just now"}
                      </dd>
                    </div>
                  </dl>
                  {onSelect && (
                    <button
                      onClick={() => onSelect(trip.id)}
                      className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Show route
                    </button>
                  )}
                </div>
              </Popup>
            </AnimatedMarker>
          );
        })}
      </MapContainer>

      {!ready && <div className="absolute inset-0 bg-slate-100 animate-pulse" />}
    </div>
  );
}
