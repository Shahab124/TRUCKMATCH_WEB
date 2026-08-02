import client from "./client";

// Shipper books one of their loads onto a driver's trip.
export async function createBooking({ trip_id, load_id }) {
  const { data } = await client.post("/bookings", { trip_id, load_id });
  return data;
}

// Works for both roles — backend branches on the caller's role.
export async function getMyBookings() {
  const { data } = await client.get("/bookings/my");
  return data;
}

// One booking plus its status timeline.
export async function getBooking(bookingId) {
  const { data } = await client.get(`/bookings/${bookingId}`);
  return data;
}

export async function completeBooking(bookingId) {
  const { data } = await client.put(`/bookings/${bookingId}/complete`);
  return data;
}

export async function rateBooking(bookingId, { stars, note }) {
  const { data } = await client.post(`/bookings/${bookingId}/rating`, { stars, note });
  return data;
}

export async function acceptBooking(bookingId) {
  const { data } = await client.put(`/bookings/${bookingId}/accept`);
  return data;
}

export async function rejectBooking(bookingId) {
  const { data } = await client.put(`/bookings/${bookingId}/reject`);
  return data;
}
