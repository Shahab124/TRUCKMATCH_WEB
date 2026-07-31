const COLORS = {
  emerald: ["open", "available", "active", "accepted", "delivered", "completed"],
  amber: ["pending", "booked", "in_transit", "intransit", "assigned"],
  slate: ["cancelled", "canceled", "rejected", "expired", "closed"],
};

export function statusColor(status) {
  const key = String(status ?? "").toLowerCase().replace(/\s+/g, "_");
  for (const [color, values] of Object.entries(COLORS)) {
    if (values.includes(key)) return color;
  }
  return "slate";
}