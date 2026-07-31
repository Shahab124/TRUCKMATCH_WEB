import client from "./client";

export async function getMyLoads() {
  const { data } = await client.get("/loads/my");
  return data;
}

export async function getLoad(loadId) {
  const { data } = await client.get(`/loads/${loadId}`);
  return data;
}

export async function createLoad(payload) {
  const { data } = await client.post("/loads", payload);
  return data;
}

export async function updateLoad(loadId, payload) {
  const { data } = await client.put(`/loads/${loadId}`, payload);
  return data;
}

export async function deleteLoad(loadId) {
  const { data } = await client.delete(`/loads/${loadId}`);
  return data;
}