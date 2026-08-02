// Each lifecycle state gets its own colour so a glance reads the status.
// Keys are normalised (lowercase, spaces to underscores).
const COLORS = {
  emerald: ["open", "available", "active", "accepted"],
  sky: ["in_transit", "intransit", "assigned", "booked"],
  violet: ["delivered", "completed"],
  amber: ["pending", "awaiting"],
  slate: ["cancelled", "canceled", "rejected", "expired", "closed", "inactive"],
};

export function statusColor(status) {
  const key = String(status ?? "").toLowerCase().replace(/\s+/g, "_");
  for (const [color, values] of Object.entries(COLORS)) {
    if (values.includes(key)) return color;
  }
  return "slate";
}
