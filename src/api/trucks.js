import client from "./client";

export async function getMyTrucks() {
  const { data } = await client.get("/trucks/my");
  return data;
}

export async function createTruck(payload) {
  const { data } = await client.post("/trucks", payload);
  return data;
}

export async function deleteTruck(truckId) {
  const { data } = await client.delete(`/trucks/${truckId}`);
  return data;
}
