import { useEffect, useRef, useState } from "react";
import { cityLatLng, interpolate } from "../lib/cities";

/**
 * DEMO ONLY — fakes trucks moving so the map is alive in a pitch.
 *
 * Each trip creeps from its origin city toward its destination, looping.
 * Nothing here talks to the backend.
 *
 * ===================== WHERE THE REAL FEED PLUGS IN =====================
 * Delete this hook and poll the API instead:
 *
 *   const { data: trips } = useFetch(getActiveLocations);   // GET /trips/active/locations
 *   useEffect(() => { const id = setInterval(reload, 10000); return () => clearInterval(id); }, []);
 *
 * The shape returned here is identical to that endpoint's, so <TripMap>
 * needs no changes when you swap. Drivers report positions via
 * PUT /trips/{id}/location — from a phone's geolocation or a GPS box.
 * =======================================================================
 */
export function useSimulatedPositions(trips, { enabled, speed = 0.02 } = {}) {
  const [positions, setPositions] = useState({});
  const progress = useRef({});

  useEffect(() => {
    if (!enabled || !trips?.length) {
      setPositions({});
      return;
    }

    // Only trips whose endpoints we can place on the map can be simulated.
    const routes = trips
      .map((t) => ({ id: t.id, from: cityLatLng(t.origin), to: cityLatLng(t.destination) }))
      .filter((r) => r.from && r.to);

    if (!routes.length) return;

    const id = setInterval(() => {
      const next = {};
      for (const r of routes) {
        const p = ((progress.current[r.id] ?? Math.random() * 0.3) + speed) % 1;
        progress.current[r.id] = p;
        next[r.id] = interpolate(r.from, r.to, p);
      }
      setPositions(next);
    }, 1000);

    return () => clearInterval(id);
  }, [trips, enabled, speed]);

  return positions;
}
