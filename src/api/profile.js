import client from "./client";

export async function getMe() {
  const { data } = await client.get("/auth/me");
  return data;
}

// Name and phone only. The API ignores anything else by design.
export async function updateMe({ name, phone }) {
  const { data } = await client.put("/auth/me", { name, phone });
  return data;
}
