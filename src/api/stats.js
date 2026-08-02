import client from "./client";

export async function getSummary() {
  const { data } = await client.get("/stats/summary");
  return data;
}
