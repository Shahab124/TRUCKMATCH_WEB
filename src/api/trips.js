import client from "./client";

export async function getMyTrips() {
  const { data } = await client.get("/trips/my");
  return data;
}

export async function getTrip(tripId) {
  const { data } = await client.get(`/trips/${tripId}`);
  return data;
}

export async function createTrip(payload) {
  const { data } = await client.post("/trips", payload);
  return data;
}

// Every trip that has a reported position — the live map's data source.
export async function getActiveLocations() {
  const { data } = await client.get("/trips/active/locations");
  return data;
}

// A driver reports where their trip currently is. Real GPS hardware would
// call exactly this.
export async function updateTripLocation(tripId, { lat, lng }) {
  const { data } = await client.put(`/trips/${tripId}/location`, { lat, lng });
  return data;
}

// origin + destination + min_capacity -> open trips that can carry the load
export async function searchTrips({ origin, destination, min_capacity = 0 }) {
  const { data } = await client.get("/trips/search", {
    params: { origin, destination, min_capacity },
  });
  return data;
}
