// One place that turns an axios error into a human sentence.
// Reused by every page so a 403 never reads as "backend down" again.
export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err?.response) return "Could not reach the API. Is your backend running?";

  const { status, data } = err.response;
  const detail = data?.detail;
  if (typeof detail === "string") return detail;

  if (status === 401) return "Your session expired. Please sign in again.";
  if (status === 403) return "You don't have access to that.";
  if (status === 404) return "We couldn't find that.";
  return fallback;
}
