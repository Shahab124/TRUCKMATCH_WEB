import { useEffect, useState, useCallback } from "react";
import { errorMessage } from "../lib/errors";

// The list-page fetch pattern in one place: loading + error + cancel-on-unmount
// + a reload() trigger. `data` starts null; `setData` is exposed for optimistic
// updates (removing a deleted row, flipping a booking status).
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.resolve(fetcher())
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(errorMessage(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { data, loading, error, reload, setData };
}
